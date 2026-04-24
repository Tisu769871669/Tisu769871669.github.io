import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../App'

afterEach(() => {
  document.body.innerHTML = ''
  window.history.pushState({}, '', '/')
})

describe('client routing', () => {
  it('renders a blog detail page from a direct URL', () => {
    window.history.pushState({}, '', '/blog/vscode-fastapi-rag-poc')

    render(<App />)

    expect(
      screen.getByRole('heading', { name: '前端不是把 AI 接进来就完了' })
    ).toBeInTheDocument()
  })

  it('renders a project detail page from a direct URL', () => {
    window.history.pushState({}, '', '/projects/agent-bridge-platform')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'OpenClaw 多服务协同平台' })).toBeInTheDocument()
  })

  it('keeps the GitHub Pages SPA fallback wired', () => {
    const fallback = readFileSync('public/404.html', 'utf8')
    const shell = readFileSync('index.html', 'utf8')

    expect(fallback).toContain('?redirect=')
    expect(shell).toContain('replaceState')
    expect(shell).toContain('redirect')
  })
})
