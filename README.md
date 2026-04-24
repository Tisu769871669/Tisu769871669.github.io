# Junne 技术笔记

一个静态技术笔记站，用来放 AI / Agent、前端、RAG、安全研究和部署运维相关记录。公开页面只写方法和复盘，不放真实配置、账号凭据、内网信息或投递细节。

## Tech Stack

- React + Vite + TypeScript
- MDX notes in `src/content/posts`
- Vitest content checks and privacy scan
- GitHub Pages workflow in `.github/workflows/deploy.yml`

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run privacy:scan
npm run build
```

Public pages only expose email and GitHub. Do not add phone numbers, credentials, internal deployment details, private IPs, interview notes, or company-specific application material.
