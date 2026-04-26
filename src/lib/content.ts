import difyWorkflowRaw from '../content/posts/dify-agent-workflow-engineering.mdx?raw'
import agentBridgeRaw from '../content/posts/agent-bridge-session-isolation.mdx?raw'
import vscodeRagRaw from '../content/posts/vscode-fastapi-rag-poc.mdx?raw'
import apiDocsRaw from '../content/posts/local-api-docs-guide.mdx?raw'
import webDebuggingRaw from '../content/posts/web-debugging-notes.mdx?raw'
import frpRaw from '../content/posts/frp-public-web-bridge.mdx?raw'
import promptInjectionRaw from '../content/posts/prompt-injection-guard-architecture.mdx?raw'
import paperReadingRaw from '../content/posts/read-security-paper-mainline.mdx?raw'
import adversarialWorkflowRaw from '../content/posts/adversarial-training-workflow.mdx?raw'
import agentHttpBridgeRaw from '../content/posts/agent-http-bridge-contract.mdx?raw'
import leadgenSkillRaw from '../content/posts/leadgen-skill-pipeline-notes.mdx?raw'
import agentFailureReplayRaw from '../content/posts/agent-failure-replay-observability.mdx?raw'
import modelAdapterRaw from '../content/posts/model-adapter-openai-compatible-boundary.mdx?raw'
import ragJsonStoreRaw from '../content/posts/rag-json-store-citation-checklist.mdx?raw'
import ideWritebackRaw from '../content/posts/ide-preview-writeback-state-machine.mdx?raw'
import difyInputNormalizeRaw from '../content/posts/dify-input-normalization-workflow.mdx?raw'
import biatIdsRaw from '../content/posts/biat-ids-research-mainline.mdx?raw'
import researchBoundariesRaw from '../content/posts/research-contribution-boundaries.mdx?raw'
import tushareApiRaw from '../content/posts/tushare-data-api-indexing.mdx?raw'
import notesSiteDesignRaw from '../content/posts/notes-site-design-and-tech-stack.mdx?raw'
import guiyangOpsRaw from '../content/posts/guiyang-ops-disaster-recovery-notes.mdx?raw'
import agentPoolInfraRaw from '../content/posts/agent-pool-customer-service-infra.mdx?raw'

export type Visibility = 'public' | 'draft'

export type PostMeta = {
  title: string
  date: string
  summary: string
  tags: string[]
  project: string
  visibility: Visibility
  readingMinutes: number
}

export type Post = PostMeta & {
  slug: string
  body: string
}

export type Project = {
  slug: string
  title: string
  summary: string
  problem: string
  approach: string
  result: string
  stack: string[]
  status: '工作流实践' | '工程整理' | 'PoC / Demo' | '运维实践' | 'Research'
  relatedPost: string
}

export type TechnologySpace = {
  slug: string
  label: string
  description: string
  noteTags: string[]
  projectStack: string[]
}

export type IdeaNote = {
  title: string
  thought: string
  solution: string
  action: string
}

type PostSource = {
  slug: string
  raw: string | { default: string }
}

export const siteProfile = {
  name: 'Junne',
  role: '',
  headline: '问题先记下',
  subhead:
    '主要是 LLM / Agent、前后端联调、安全研究和 AI 工具链。想起来就写一点，先不追求完整。',
  focus:
    '当场想清楚的东西，过几天常常会变模糊。先留下可搜索的草稿，后面回头查会轻松一些。',
  contact: {
    email: '769871669@qq.com',
    github: 'https://github.com/Tisu769871669'
  },
  principles: [
    '先把问题写清楚，再决定工具和模型怎么接',
    '把调试过程留下来，下一次少靠记忆找路',
    '方法可以公开，敏感细节留在本地'
  ]
}

export const projects: Project[] = [
  {
    slug: 'dify-agent-workflow',
    title: 'Dify 多场景 Agent 与自定义工具体系',
    summary:
      '把客服、下单、咨询和分析等多场景需求拆成工作流、变量、工具调用和兜底路径，沉淀成可复用的 Agent 模板。',
    problem:
      '业务方要的不是一次模型问答，而是能处理状态、缺参、工具异常和多轮上下文的稳定流程。',
    approach:
      '用 Workflow 承载确定链路，用变量保存关键状态，用知识库和业务 API 处理外部事实，再用条件分支做失败兜底。',
    result:
      '形成从意图识别、状态判断、工具/RAG 调用到结构化输出的复用模板，后续场景可以沿同一套边界扩展。',
    stack: ['Dify', 'Workflow', 'Tool Calling', 'RAG', 'Mem0'],
    status: '工作流实践',
    relatedPost: 'dify-agent-workflow-engineering'
  },
  {
    slug: 'agent-bridge-platform',
    title: 'OpenClaw 多服务协同平台',
    summary:
      '用桥接层把外部系统、企业微信和 Agent 连起来，解决消息路由、会话隔离和人设配置的工程化问题。',
    problem:
      'Agent 一旦被外部系统调用，就必须面对消息格式不一致、上下文串扰、日志追踪和失败排查。',
    approach:
      '拆分 CRM、消息桥接、晨报、看板和 Agent 入口服务，用 HTTP Bridge 和 conversation_id 做路由与隔离。',
    result:
      '外部消息可以通过统一入口进入指定 Agent，服务职责清晰，Persona 与规则也可以结构化维护。',
    stack: ['Node.js', 'Express', 'OpenClaw', 'HTTP API', 'SQLite'],
    status: '工程整理',
    relatedPost: 'agent-bridge-session-isolation'
  },
  {
    slug: 'vscode-rag-poc',
    title: '工业开发助手 PoC',
    summary:
      '用 VS Code Extension + FastAPI + RAG 验证 AI 辅助开发闭环，打通选区读取、生成、预览确认和结果写回。',
    problem:
      'IDE 场景里的 AI 功能不能只生成答案，还要避免错误内容直接污染用户代码。',
    approach:
      '前端把选区读取、生成中、预览确认和写回拆成明确状态；后端用模型 Adapter 和 RAG 处理专业知识。',
    result:
      '跑通从 IDE 上下文到模型调用、知识检索、结果展示和用户确认写回的最小闭环。',
    stack: ['VS Code Extension', 'TypeScript', 'FastAPI', 'RAG', 'OpenAI Compatible'],
    status: 'PoC / Demo',
    relatedPost: 'vscode-fastapi-rag-poc'
  },
  {
    slug: 'guiyang-ops-disaster-recovery',
    title: '贵阳运维与灾备记录',
    summary:
      '整理一次线下运维和灾备过程，把环境部署、数据同步、系统镜像、恢复验证和后处理拆成可复用检查点。',
    problem:
      '线下环境的运维记录如果只保留临时操作步骤，后续恢复、迁移或复盘时很难判断哪些配置能复用，哪些必须重新规划。',
    approach:
      '把部署、同步、镜像、恢复和验证拆成独立阶段，用 Clonezilla、Ubuntu 运维检查和数据同步清单记录灾备链路。',
    result:
      '沉淀出公开版方法笔记和本地运行手册的边界：公开页面只放流程、风险和检查点，真实配置与凭据留在本地。',
    stack: ['Ubuntu', 'Clonezilla', '数据同步', '灾备', '运维'],
    status: '运维实践',
    relatedPost: 'guiyang-ops-disaster-recovery-notes'
  }
]

export const ideaNotes: IdeaNote[] = [
  {
    title: '笔记能不能先从一句问题开始',
    thought: '有些东西还没想清楚，但直接丢掉又可惜。先把问题放上来，后面再慢慢补。',
    solution: '每条想法先留出两个位置：可能的解决方案、实际行动。想法不急着变成完整笔记。',
    action: '先把首页这块改成固定结构，后面想到什么就往下面加。'
  },
  {
    title: 'AI 生成结果要不要先说明改动范围',
    thought: '直接给结果有时候不够安心，尤其是会写回文件或改代码的时候。',
    solution: '先让工具说清楚会改哪里、为什么改、有没有风险，再让人确认。',
    action: '可以先在 VS Code / RAG PoC 里做一个简单的预览说明。'
  },
  {
    title: 'Agent 出错的样本应该留下来',
    thought: '失败样本如果只在控制台里闪一下，后面就很难复盘。',
    solution: '把失败原因按消息格式、上下文、工具调用、权限问题分一下类。',
    action: '后面给 Bridge 加一个失败记录页，先不用复杂，能查就行。'
  }
]

export const technologySpaces: TechnologySpace[] = [
  {
    slug: 'ai-agent',
    label: 'AI / Agent',
    description: '工作流、工具调用、会话和 Agent 编排',
    noteTags: ['AI Agent', 'Workflow', '工具调用', 'LLM安全', '提示注入', 'OpenClaw', 'Dify'],
    projectStack: ['Dify', 'Workflow', 'Tool Calling', 'OpenClaw', 'Mem0']
  },
  {
    slug: 'frontend-ide',
    label: '前端 / IDE',
    description: '前端状态、插件交互和 AI 写回链路',
    noteTags: ['前端工程', 'VS Code 插件', '状态管理'],
    projectStack: ['VS Code Extension', 'TypeScript']
  },
  {
    slug: 'rag-api',
    label: 'RAG / API',
    description: '知识检索、本地服务和接口契约',
    noteTags: ['RAG', 'API文档', '本地服务', 'OpenAI Compatible', '数据处理', '检索'],
    projectStack: ['RAG', 'FastAPI', 'OpenAI Compatible', 'HTTP API']
  },
  {
    slug: 'security-research',
    label: '安全 / 研究',
    description: '安全论文、提示注入、实验和 Web 调试',
    noteTags: ['LLM安全', '提示注入', 'Web安全', '安全研究', '研究笔记', '论文阅读', '对抗训练', '入侵检测', '实验复盘'],
    projectStack: []
  },
  {
    slug: 'deploy-network',
    label: '部署 / 网络',
    description: 'FRP、反向代理、远程访问和链路排查',
    noteTags: ['FRP', '反向代理', 'Nginx', '部署', '代理', '抓包', '运维', '灾备', 'Clonezilla', 'Ubuntu'],
    projectStack: ['HTTP API', 'Ubuntu', 'Clonezilla', '数据同步', '灾备', '运维']
  }
]

export const postSources: PostSource[] = [
  { slug: 'dify-agent-workflow-engineering', raw: difyWorkflowRaw },
  { slug: 'agent-bridge-session-isolation', raw: agentBridgeRaw },
  { slug: 'vscode-fastapi-rag-poc', raw: vscodeRagRaw },
  { slug: 'local-api-docs-guide', raw: apiDocsRaw },
  { slug: 'web-debugging-notes', raw: webDebuggingRaw },
  { slug: 'frp-public-web-bridge', raw: frpRaw },
  { slug: 'prompt-injection-guard-architecture', raw: promptInjectionRaw },
  { slug: 'read-security-paper-mainline', raw: paperReadingRaw },
  { slug: 'adversarial-training-workflow', raw: adversarialWorkflowRaw },
  { slug: 'agent-http-bridge-contract', raw: agentHttpBridgeRaw },
  { slug: 'leadgen-skill-pipeline-notes', raw: leadgenSkillRaw },
  { slug: 'agent-failure-replay-observability', raw: agentFailureReplayRaw },
  { slug: 'model-adapter-openai-compatible-boundary', raw: modelAdapterRaw },
  { slug: 'rag-json-store-citation-checklist', raw: ragJsonStoreRaw },
  { slug: 'ide-preview-writeback-state-machine', raw: ideWritebackRaw },
  { slug: 'dify-input-normalization-workflow', raw: difyInputNormalizeRaw },
  { slug: 'biat-ids-research-mainline', raw: biatIdsRaw },
  { slug: 'research-contribution-boundaries', raw: researchBoundariesRaw },
  { slug: 'tushare-data-api-indexing', raw: tushareApiRaw },
  { slug: 'notes-site-design-and-tech-stack', raw: notesSiteDesignRaw },
  { slug: 'guiyang-ops-disaster-recovery-notes', raw: guiyangOpsRaw },
  { slug: 'agent-pool-customer-service-infra', raw: agentPoolInfraRaw }
]

export const posts: Post[] = postSources
  .map((source) => ({
    slug: source.slug,
    ...parsePost(normalizeRaw(source.raw))
  }))
  .filter((post) => post.visibility === 'public')
  .sort((left, right) => right.date.localeCompare(left.date))

function normalizeRaw(raw: string | { default: string }): string {
  return typeof raw === 'string' ? raw : raw.default
}

function parsePost(raw: string): PostMeta & { body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    throw new Error('Post is missing frontmatter')
  }

  const frontmatter = new Map<string, string>()
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    frontmatter.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim())
  }

  return {
    title: readString(frontmatter, 'title'),
    date: readString(frontmatter, 'date'),
    summary: readString(frontmatter, 'summary'),
    tags: readArray(frontmatter, 'tags'),
    project: readString(frontmatter, 'project'),
    visibility: readVisibility(frontmatter, 'visibility'),
    readingMinutes: Number(readString(frontmatter, 'readingMinutes')),
    body: match[2].trim()
  }
}

function readString(frontmatter: Map<string, string>, key: string): string {
  const value = frontmatter.get(key)
  if (!value) {
    throw new Error(`Missing frontmatter field: ${key}`)
  }
  return value.replace(/^["']|["']$/g, '')
}

function readArray(frontmatter: Map<string, string>, key: string): string[] {
  const value = readString(frontmatter, key)
  if (!value.startsWith('[') || !value.endsWith(']')) {
    throw new Error(`Frontmatter field ${key} must be an inline array`)
  }
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function readVisibility(frontmatter: Map<string, string>, key: string): Visibility {
  const value = readString(frontmatter, key)
  if (value !== 'public' && value !== 'draft') {
    throw new Error(`Invalid visibility: ${value}`)
  }
  return value
}

export function getFeaturedPosts(): Post[] {
  return posts.slice(0, 3)
}

export function getAllTags(): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
    a.localeCompare(b, 'zh-Hans-CN')
  )
}

export function searchPosts(query: string, tag?: string, spaceSlug?: string): Post[] {
  const terms = query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  return posts.filter((post) => {
    const matchesTag = !tag || post.tags.includes(tag)
    const matchesSpace = !spaceSlug || postMatchesSpace(post, spaceSlug)
    const haystack = [post.title, post.summary, post.project, post.tags.join(' '), post.body]
      .join(' ')
      .toLocaleLowerCase()
    const matchesQuery = terms.length === 0 || terms.every((term) => haystack.includes(term))
    return matchesTag && matchesSpace && matchesQuery
  })
}

export function getSpaceBySlug(slug?: string): TechnologySpace | undefined {
  return technologySpaces.find((space) => space.slug === slug)
}

export function getPostsBySpace(spaceSlug?: string): Post[] {
  if (!spaceSlug) return posts
  return posts.filter((post) => postMatchesSpace(post, spaceSlug))
}

export function getProjectsBySpace(spaceSlug?: string): Project[] {
  if (!spaceSlug) return projects
  return projects.filter((project) => projectMatchesSpace(project, spaceSlug))
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getRelatedProject(post: Post): Project | undefined {
  return projects.find((project) => project.relatedPost === post.slug)
}

function postMatchesSpace(post: Post, spaceSlug: string): boolean {
  const space = getSpaceBySlug(spaceSlug)
  if (!space) return false
  return hasAnyMatch(post.tags, space.noteTags) || space.projectStack.some((term) => post.project.includes(term))
}

function projectMatchesSpace(project: Project, spaceSlug: string): boolean {
  const space = getSpaceBySlug(spaceSlug)
  if (!space) return false
  const relatedPost = getPostBySlug(project.relatedPost)
  return hasAnyMatch(project.stack, space.projectStack) || Boolean(relatedPost && postMatchesSpace(relatedPost, spaceSlug))
}

function hasAnyMatch(values: string[], terms: string[]): boolean {
  return values.some((value) =>
    terms.some((term) => value.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
  )
}
