import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const excludedDirs = new Set(['.git', '.playwright-cli', 'coverage', 'dist', 'node_modules'])
const excludedFiles = new Set(['package-lock.json', 'scripts/privacy-scan.mjs'])
const blockedPatterns = [
  { name: 'mainland phone number', pattern: /1[3-9]\d{9}/ },
  { name: 'credential wording', pattern: /(密码|token|api[_-]?key|secret)/i },
  { name: 'job interview wording', pattern: /(面经|大疆)/ },
  {
    name: 'private network address',
    pattern: /\b(10|172\.(1[6-9]|2\d|3[0-1])|192\.168)\.\d{1,3}\.\d{1,3}\b/
  }
]
const allowedPhrases = ['id-token: write']

const files = []

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      if (!excludedDirs.has(name)) {
        walk(path)
      }
      continue
    }

    if (/\.(tsx?|mdx?|md|html|css|ya?ml|mjs|js|json)$/.test(name)) {
      files.push(path)
    }
  }
}

walk(root)

const failures = []
for (const file of files) {
  const relativePath = relative(root, file).replaceAll('\\', '/')
  if (excludedFiles.has(relativePath)) {
    continue
  }

  let content = readFileSync(file, 'utf8')
  for (const phrase of allowedPhrases) {
    content = content.replaceAll(phrase, '')
  }

  for (const rule of blockedPatterns) {
    if (rule.pattern.test(content)) {
      failures.push(`${relativePath}: ${rule.name}`)
    }
  }
}

if (failures.length > 0) {
  console.error('Privacy scan failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Privacy scan passed (${files.length} files checked).`)
