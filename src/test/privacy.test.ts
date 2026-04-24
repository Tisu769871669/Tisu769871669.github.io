import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { posts, projects, siteProfile } from '../lib/content'

describe('public content privacy', () => {
  it('does not expose phone numbers or company-specific interview material', () => {
    const serialized = JSON.stringify({ posts, projects, siteProfile })
    const interviewNotes = '面' + '经'
    const companyName = '大' + '疆'

    expect(serialized).not.toMatch(/1[3-9]\d{9}/)
    expect(serialized).not.toContain(interviewNotes)
    expect(serialized).not.toContain(companyName)
  })

  it('keeps contact surface to email and GitHub only', () => {
    expect(siteProfile.contact.email).toBe('769871669@qq.com')
    expect(siteProfile.contact.github).toBe('https://github.com/Tisu769871669')
    expect(Object.keys(siteProfile.contact)).toEqual(['email', 'github'])
  })

  it('avoids first-person self-packaging in public copy', () => {
    const publicCopyFiles = [
      'index.html',
      'src/App.tsx',
      'src/lib/content.ts',
      ...readdirSync('src/content/posts').map((file) => `src/content/posts/${file}`)
    ]
    const publicCopy = publicCopyFiles.map((file) => readFileSync(file, 'utf8')).join('\n')

    expect(publicCopy).not.toContain('朱军')
    expect(publicCopy).not.toContain('ZJ')
    expect(publicCopy).not.toContain('我')
  })
})
