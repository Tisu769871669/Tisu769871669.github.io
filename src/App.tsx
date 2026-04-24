import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  FolderGit2,
  Github,
  GitBranch,
  Layers,
  Mail,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  Sun
} from 'lucide-react'
import {
  getFeaturedPosts,
  getPostBySlug,
  getPostsBySpace,
  getProjectBySlug,
  getProjectsBySpace,
  getRelatedProject,
  getSpaceBySlug,
  ideaNotes,
  posts,
  projects,
  searchPosts,
  siteProfile,
  technologySpaces
} from './lib/content'
import type { Post, Project } from './lib/content'

type Route =
  | { name: 'home' }
  | { name: 'blog' }
  | { name: 'post'; slug: string }
  | { name: 'projects' }
  | { name: 'project'; slug: string }
  | { name: 'about' }

type ThemeName = 'light' | 'dark'

const capabilitySignals = [
  {
    title: '工作流哪里容易断',
    text: '跑通以后顺手记一下状态、工具调用、RAG 和失败兜底。',
    icon: GitBranch
  },
  {
    title: '前端状态怎么收住',
    text: 'AI 功能如果没有确认、预览和回滚，很容易变得不可控。',
    icon: Code2
  },
  {
    title: '公开前再看一遍',
    text: '方法可以记，具体配置、数据和凭据不放上来。',
    icon: ShieldCheck
  }
]

function parseRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const segments = path.split('/').filter(Boolean)

  if (segments[0] === 'blog' && segments[1]) return { name: 'post', slug: segments[1] }
  if (segments[0] === 'blog') return { name: 'blog' }
  if (segments[0] === 'projects' && segments[1]) return { name: 'project', slug: segments[1] }
  if (segments[0] === 'projects') return { name: 'projects' }
  if (segments[0] === 'about') return { name: 'about' }
  return { name: 'home' }
}

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

function handleInternalLink(event: MouseEvent<HTMLAnchorElement>, to: string) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return
  }

  event.preventDefault()
  navigate(to)
}

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute())
  const [theme, setTheme] = useState<ThemeName>(() => readInitialTheme())
  const [activeSpace, setActiveSpace] = useState<string>(() => readInitialActiveSpace())
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => readInitialSidebarCollapsed())

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('site-theme', theme)
    } catch {
      // Ignore storage failures in private browsing or tests.
    }
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem('active-space', activeSpace)
    } catch {
      // Ignore storage failures in private browsing or tests.
    }
  }, [activeSpace])

  useEffect(() => {
    try {
      window.localStorage.setItem('sidebar-collapsed', sidebarCollapsed ? 'true' : 'false')
    } catch {
      // Ignore storage failures in private browsing or tests.
    }
  }, [sidebarCollapsed])

  const selectedSpace = activeSpace === 'all' ? undefined : activeSpace
  const handleSpaceSelect = (spaceSlug: string) => {
    setActiveSpace(spaceSlug)
    if (route.name !== 'blog' && route.name !== 'projects') {
      navigate('/blog')
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <SiteHeader route={route} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <div className={`workspace-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TechSidebar
          activeSpace={activeSpace}
          collapsed={sidebarCollapsed}
          onSelectSpace={handleSpaceSelect}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />
        <main>
          {route.name === 'home' && <HomePage />}
          {route.name === 'blog' && <BlogPage activeSpace={selectedSpace} />}
          {route.name === 'post' && <PostPage slug={route.slug} />}
          {route.name === 'projects' && <ProjectsPage activeSpace={selectedSpace} />}
          {route.name === 'project' && <ProjectPage slug={route.slug} />}
          {route.name === 'about' && <AboutPage />}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function LinkButton({
  to,
  children,
  className = ''
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <a className={`action-link ${className}`} href={to} onClick={(event) => handleInternalLink(event, to)}>
      {children}
    </a>
  )
}

function SiteHeader({
  route,
  theme,
  onToggleTheme
}: {
  route: Route
  theme: ThemeName
  onToggleTheme: () => void
}) {
  const activeSection = route.name === 'post' ? 'blog' : route.name === 'project' ? 'projects' : route.name
  const links = [
    { label: '笔记', path: '/blog', key: 'blog' },
    { label: '项目', path: '/projects', key: 'projects' },
    { label: '关于', path: '/about', key: 'about' }
  ]

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => handleInternalLink(event, '/')}>
        <span className="brand-mark">JN</span>
        <span className="brand-text">
          <strong>{siteProfile.name}</strong>
        </span>
      </a>
      <nav aria-label="主导航">
        {links.map((link) => (
          <a
            aria-current={activeSection === link.key ? 'page' : undefined}
            href={link.path}
            key={link.path}
            onClick={(event) => handleInternalLink(event, link.path)}
          >
            {link.label}
          </a>
        ))}
        <a aria-label="GitHub" className="icon-link" href={siteProfile.contact.github} rel="noreferrer" target="_blank">
          <Github size={18} />
        </a>
        <a aria-label="邮箱" className="icon-link" href={`mailto:${siteProfile.contact.email}`}>
          <Mail size={18} />
        </a>
        <button
          aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    </header>
  )
}

function TechSidebar({
  activeSpace,
  collapsed,
  onSelectSpace,
  onToggle
}: {
  activeSpace: string
  collapsed: boolean
  onSelectSpace: (spaceSlug: string) => void
  onToggle: () => void
}) {
  const activeLabel = activeSpace === 'all' ? '全部' : getSpaceBySlug(activeSpace)?.label ?? '全部'
  const allItem = {
    slug: 'all',
    label: '全部',
    description: '全部笔记和项目',
    noteCount: posts.length,
    projectCount: projects.length,
    shortLabel: 'ALL'
  }
  const spaceItems = technologySpaces.map((space, index) => ({
    slug: space.slug,
    label: space.label,
    description: space.description,
    noteCount: getPostsBySpace(space.slug).length,
    projectCount: getProjectsBySpace(space.slug).length,
    shortLabel: getSpaceShortLabel(space.label, index)
  }))
  const items = [allItem, ...spaceItems]

  return (
    <aside className="tech-sidebar" aria-label="技术类型">
      <div className="sidebar-top">
        {!collapsed && (
          <div>
            <p>技术空间</p>
            <strong>{activeLabel}</strong>
          </div>
        )}
        <button
          aria-label={collapsed ? '展开技术侧边栏' : '收起技术侧边栏'}
          className="sidebar-toggle"
          type="button"
          onClick={onToggle}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="space-list">
        {items.map((item) => (
          <button
            aria-pressed={activeSpace === item.slug}
            className={`space-button ${activeSpace === item.slug ? 'active' : ''}`}
            key={item.slug}
            title={collapsed ? item.label : undefined}
            type="button"
            onClick={() => onSelectSpace(item.slug)}
          >
            <span className="space-icon" aria-hidden="true">
              {item.slug === 'all' ? <Layers size={16} /> : item.shortLabel}
            </span>
            {!collapsed && (
              <>
                <span className="space-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="space-count">
                  <span>{item.noteCount}记</span>
                  <span>{item.projectCount}项</span>
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </aside>
  )
}

function HomePage() {
  const featured = getFeaturedPosts()
  const heroPost = featured[0]
  const otherFeatured = featured.slice(1)
  const featuredProject = projects[0]

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">慢慢整理中</p>
          <h1>{siteProfile.headline}</h1>
          <p className="hero-subhead">{siteProfile.subhead}</p>
          <p className="hero-focus">{siteProfile.focus}</p>
          <div className="hero-actions">
            <LinkButton to="/blog" className="primary-action">
              进入笔记 <BookOpen size={18} />
            </LinkButton>
            <LinkButton to="/projects">
              翻项目记录 <FolderGit2 size={18} />
            </LinkButton>
          </div>
          <div className="hero-stats" aria-label="站点概览">
            <StatBlock label="公开笔记" value={`${posts.length}`} />
            <StatBlock label="项目案例" value={`${projects.length}`} />
            <StatBlock label="草稿本" value="本地" />
          </div>
        </div>
        <aside className="hero-panel" aria-label="技术工作台摘要">
          <div className="panel-toolbar">
            <span>desk-note.md</span>
            <span>draft</span>
          </div>
          <div className="signal-card">
            <p className="panel-label">今天先记到这</p>
            <h2>做项目时留下来的线索</h2>
            <p>
              有些东西当场想明白了，过两周又会忘。能公开的过程先放起来，方便后面回头查。
            </p>
          </div>
          <div className="signal-list">
            {capabilitySignals.map((item) => {
              const Icon = item.icon
              return (
                <div className="signal-item" key={item.title}>
                  <Icon size={20} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </section>

      <section className="idea-band">
        <SectionHeading
          kicker="奇思妙想"
          title="先把想法放到草稿区"
          summary="不一定马上整理完整。先记一个问题，下面慢慢补可能的解决方案和实际行动。"
        />
        <div className="idea-grid">
          {ideaNotes.map((item) => (
            <article className="idea-card" key={item.title}>
              <p className="idea-label">想法</p>
              <h3>{item.title}</h3>
              <p>{item.thought}</p>
              <div className="idea-notes">
                <section>
                  <span>可能的解决方案</span>
                  <p>{item.solution}</p>
                </section>
                <section>
                  <span>实际行动</span>
                  <p>{item.action}</p>
                </section>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-section">
        <SectionHeading
          kicker="最近记的"
          title="最近留下来的几条"
          summary="尽量少写结论，多留过程：当时怎么拆、哪里卡住、后来怎么绕过去。"
        />
        <div className="feature-layout">
          {heroPost && <FeaturedPostCard post={heroPost} />}
          <div className="side-stack">
            {otherFeatured.map((post) => (
              <PostCard key={post.slug} post={post} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="project-showcase">
        <div className="showcase-copy">
          <p className="section-kicker">项目记录</p>
          <h2>{featuredProject.title}</h2>
          <p>{featuredProject.summary}</p>
          <LinkButton to={`/projects/${featuredProject.slug}`} className="primary-action">
            看这次复盘 <ArrowRight size={16} />
          </LinkButton>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} />
          ))}
        </div>
      </section>
    </>
  )
}

function BlogPage({ activeSpace }: { activeSpace?: string }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const selectedSpace = getSpaceBySlug(activeSpace)
  const filteredPosts = useMemo(
    () => searchPosts(deferredQuery, undefined, activeSpace),
    [deferredQuery, activeSpace]
  )

  return (
    <section className="page-wrap">
      <PageIntro
        title={selectedSpace ? selectedSpace.label : '笔记'}
        summary={selectedSpace?.description ?? '主要放 AI、前端、RAG、安全和部署调试相关的记录。写得不一定完整，先留着以后能找回来。'}
      />
      <div className="search-panel">
        <label>
          <span className="sr-only">全文检索</span>
          <Search size={18} />
          <input
            aria-label="全文检索"
            placeholder="全文检索标题、正文、项目名"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="result-bar">
        <span>{filteredPosts.length} 条记录</span>
        <span>{query.trim() ? `检索：${query.trim()}` : selectedSpace?.label ?? '全部类型'}</span>
      </div>
      {filteredPosts.length > 0 ? (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">这个类型下暂时没有公开笔记。</div>
      )}
    </section>
  )
}

function PostPage({ slug }: { slug: string }) {
  const post = getPostBySlug(slug)

  if (!post) {
    return <NotFound title="笔记不存在" />
  }

  const relatedProject = getRelatedProject(post)

  return (
    <article className="article-layout">
      <a className="back-chip" href="/blog" onClick={(event) => handleInternalLink(event, '/blog')}>
        <ArrowLeft size={17} />
        返回笔记列表
      </a>
      <header className="article-head">
        <p className="article-meta">
          {formatDate(post.date)} · {post.readingMinutes} min · {post.project}
        </p>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <TagList tags={post.tags} />
      </header>
      <MarkdownArticle body={post.body} />
      {relatedProject && (
        <aside className="related-project">
          <span>相关项目</span>
          <h2>{relatedProject.title}</h2>
          <p>{relatedProject.summary}</p>
          <LinkButton to={`/projects/${relatedProject.slug}`}>
            查看项目 <ArrowRight size={16} />
          </LinkButton>
        </aside>
      )}
    </article>
  )
}

function ProjectsPage({ activeSpace }: { activeSpace?: string }) {
  const selectedSpace = getSpaceBySlug(activeSpace)
  const filteredProjects = getProjectsBySpace(activeSpace)

  return (
    <section className="page-wrap">
      <PageIntro
        title={selectedSpace ? `${selectedSpace.label} 项目` : '项目记录'}
        summary={selectedSpace?.description ?? '项目页只写当时的问题、方案和技术栈。配置、数据和具体细节留在本地。'}
      />
      {filteredProjects.length > 0 ? (
        <div className="project-grid expanded">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} detailed />
          ))}
        </div>
      ) : (
        <div className="empty-state">这个类型下暂时没有公开项目。</div>
      )}
    </section>
  )
}

function ProjectPage({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug)

  if (!project) {
    return <NotFound title="项目不存在" />
  }

  return (
    <section className="page-wrap project-detail">
      <a className="back-chip" href="/projects" onClick={(event) => handleInternalLink(event, '/projects')}>
        <ArrowLeft size={17} />
        返回项目列表
      </a>
      <p className="section-kicker">{project.status}</p>
      <h1>{project.title}</h1>
      <p className="lead">{project.summary}</p>
      <div className="case-grid">
        <CaseBlock title="问题" text={project.problem} />
        <CaseBlock title="方案" text={project.approach} />
        <CaseBlock title="结果" text={project.result} />
      </div>
      <TagList tags={project.stack} />
      <LinkButton to={`/blog/${project.relatedPost}`} className="primary-action">
        阅读相关复盘 <ArrowRight size={16} />
      </LinkButton>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="page-wrap about-page">
      <PageIntro
        title="关于"
        summary="放一些项目坑、论文线索和没完全整理好的想法。"
      />
      <div className="about-grid">
        <div className="about-body">
          <p>
            这个站点主要用来放可公开的过程记录。项目做久了，很多细节如果不写下来，过一阵就只剩一个模糊印象。
          </p>
          <p>
            过程比结论更有用：为什么这么拆，哪里卡过，后来怎么绕过去。写得不一定像教程，更多是给后面回看时留一条线。
          </p>
          <div className="contact-row">
            <a href={siteProfile.contact.github} rel="noreferrer" target="_blank">
              <Github size={18} /> GitHub
            </a>
            <a href={`mailto:${siteProfile.contact.email}`}>
              <Mail size={18} /> {siteProfile.contact.email}
            </a>
          </div>
        </div>
        <aside className="about-panel">
          <p className="panel-label">一些提醒</p>
          <ul>
            {siteProfile.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

function SectionHeading({
  kicker,
  title,
  summary
}: {
  kicker?: string
  title: string
  summary: string
}) {
  return (
    <header className="section-heading">
      {kicker && <p className="section-kicker">{kicker}</p>}
      <h2>{title}</h2>
      <p>{summary}</p>
    </header>
  )
}

function PageIntro({
  kicker,
  title,
  summary
}: {
  kicker?: string
  title: string
  summary: string
}) {
  return (
    <header className="page-intro">
      {kicker && <p className="section-kicker">{kicker}</p>}
      <h1>{title}</h1>
      <p>{summary}</p>
    </header>
  )
}

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <a
      className="featured-post post-card-link"
      href={`/blog/${post.slug}`}
      onClick={(event) => handleInternalLink(event, `/blog/${post.slug}`)}
    >
      <div className="post-card-bar">
        <span>{post.slug}.md</span>
        <span>{post.readingMinutes} min</span>
      </div>
      <div className="post-card-body">
        <p className="post-card-date">{formatDate(post.date)}</p>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        <span className="read-more">
          打开笔记 <ArrowRight size={16} />
        </span>
      </div>
    </a>
  )
}

function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <a
      className={`post-card post-card-link ${compact ? 'compact-card' : ''}`}
      href={`/blog/${post.slug}`}
      onClick={(event) => handleInternalLink(event, `/blog/${post.slug}`)}
    >
      <div className="post-card-bar">
        <span>{post.slug}.md</span>
        <span>{post.readingMinutes} min</span>
      </div>
      <div className="post-card-body">
        <p className="post-card-date">{formatDate(post.date)}</p>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
      </div>
    </a>
  )
}

function ProjectCard({
  project,
  index,
  detailed = false
}: {
  project: Project
  index: number
  detailed?: boolean
}) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span>{String(index).padStart(2, '0')}</span>
        <span>{project.status}</span>
      </div>
      <a href={`/projects/${project.slug}`} onClick={(event) => handleInternalLink(event, `/projects/${project.slug}`)}>
        <h3>{project.title}</h3>
      </a>
      <p>{project.summary}</p>
      {detailed && (
        <dl>
          <dt>问题</dt>
          <dd>{project.problem}</dd>
          <dt>方案</dt>
          <dd>{project.approach}</dd>
        </dl>
      )}
      <TagList tags={project.stack} />
    </article>
  )
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  )
}

function MarkdownArticle({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/)

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        const lines = trimmed.split(/\n/)

        if (trimmed.startsWith('## ')) {
          return <h2 key={index}>{trimmed.replace('## ', '')}</h2>
        }

        if (trimmed.startsWith('### ')) {
          return <h3 key={index}>{trimmed.replace('### ', '')}</h3>
        }

        if (trimmed.startsWith('```')) {
          return <pre key={index}>{trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')}</pre>
        }

        if (lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={index}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^- /, '')}</li>
              ))}
            </ul>
          )
        }

        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={index}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          )
        }

        return <p key={index}>{trimmed.replace(/\n/g, ' ')}</p>
      })}
    </div>
  )
}

function CaseBlock({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <span>{title}</span>
      <p>{text}</p>
    </section>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function NotFound({ title }: { title: string }) {
  return (
    <section className="page-wrap">
      <h1>{title}</h1>
      <LinkButton to="/">返回首页</LinkButton>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© 2026 {siteProfile.name}</span>
      <span>React / Vite / TypeScript / MDX</span>
    </footer>
  )
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date))
}

function getSpaceShortLabel(label: string, index: number): string {
  const fallback = ['AI', 'FE', 'RG', 'SE', 'DP']
  if (fallback[index]) return fallback[index]
  return label
    .split(/[ /]+/)
    .map((part) => part.slice(0, 1))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function readInitialTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem('site-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    return 'light'
  }

  return 'light'
}

function readInitialActiveSpace(): string {
  try {
    const stored = window.localStorage.getItem('active-space')
    if (!stored) return 'all'
    if (stored === 'all' || technologySpaces.some((space) => space.slug === stored)) return stored
  } catch {
    return 'all'
  }

  return 'all'
}

function readInitialSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem('sidebar-collapsed') === 'true'
  } catch {
    return false
  }
}
