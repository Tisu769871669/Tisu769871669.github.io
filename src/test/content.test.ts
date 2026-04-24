import { describe, expect, it } from 'vitest'
import { readdirSync } from 'node:fs'
import {
  getAllTags,
  getPostBySlug,
  getPostsBySpace,
  getProjectBySlug,
  getProjectsBySpace,
  postSources,
  posts,
  searchPosts,
  technologySpaces
} from '../lib/content'

describe('content registry', () => {
  it('exposes a public article timeline with complete metadata', () => {
    const publicPosts = posts

    expect(publicPosts.length).toBeGreaterThanOrEqual(8)
    expect(new Set(publicPosts.map((post) => post.slug)).size).toBe(publicPosts.length)
    for (const post of publicPosts) {
      expect(post.title).toBeTruthy()
      expect(post.summary.length).toBeGreaterThan(24)
      expect(post.tags.length).toBeGreaterThanOrEqual(3)
      expect(post.visibility).toBe('public')
    }
  })

  it('supports tag discovery and local keyword search', () => {
    expect(getAllTags()).toEqual(
      expect.arrayContaining(['AI Agent', '前端工程', 'RAG'])
    )

    const results = searchPosts('VS Code RAG')
    expect(results.map((post) => post.slug)).toContain('vscode-fastapi-rag-poc')
  })

  it('resolves article and project detail records by slug', () => {
    expect(getPostBySlug('dify-agent-workflow-engineering')?.project).toBe(
      'Dify 多场景 Agent 与自定义工具体系'
    )
    expect(getProjectBySlug('agent-bridge-platform')?.status).toBe('工程整理')
    expect(getProjectBySlug('vscode-rag-poc')?.status).toBe('PoC / Demo')
  })

  it('groups notes and projects by technology space', () => {
    expect(technologySpaces.length).toBeGreaterThanOrEqual(5)
    for (const space of technologySpaces) {
      expect(getPostsBySpace(space.slug).length).toBeGreaterThan(0)
    }

    expect(getProjectsBySpace('ai-agent').map((project) => project.slug)).toEqual(
      expect.arrayContaining(['dify-agent-workflow', 'agent-bridge-platform'])
    )
  })

  it('keeps MDX files and the content registry in sync', () => {
    const mdxSlugs = readdirSync('src/content/posts')
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''))
      .sort()
    const sourceSlugs = postSources.map((source) => source.slug).sort()
    const publicSlugs = posts.map((post) => post.slug).sort()

    expect(sourceSlugs).toEqual(mdxSlugs)
    expect(publicSlugs).toEqual(mdxSlugs)
  })
})
