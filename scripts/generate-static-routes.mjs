import { mkdirSync, copyFileSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const distDir = 'dist'
const indexFile = join(distDir, 'index.html')
const postSlugs = readdirSync('src/content/posts')
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => file.replace(/\.mdx$/, ''))

const contentSource = readFileSync('src/lib/content.ts', 'utf8')
const projectBlock = contentSource.match(/export const projects:[\s\S]*?\n\]/)?.[0] ?? ''
const projectSlugs = Array.from(projectBlock.matchAll(/slug: '([^']+)'/g), (match) => match[1])

const routes = [
  'blog',
  'projects',
  'about',
  ...postSlugs.map((slug) => `blog/${slug}`),
  ...projectSlugs.map((slug) => `projects/${slug}`)
]

for (const route of routes) {
  const target = join(distDir, route, 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(indexFile, target)
}

console.log(`Generated ${routes.length} static route entries.`)
