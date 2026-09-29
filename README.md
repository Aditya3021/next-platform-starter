# ContentForge AI

ContentForge AI is a PS-02 hackathon MVP for **Generative Content Workflows**.

## Product

Turn one campaign brief into a structured multi-platform content workflow:

**Idea → Strategy → Platform content → Quality feedback**

The current branch contains a polished interactive prototype. The next implementation step is wiring the \`/api/generate\` workflow to an LLM provider and persisting campaigns.

## Stack

- Next.js 15 App Router
- React
- Tailwind CSS v4
- Netlify-compatible deployment
- API route prepared at \`/api/generate\`

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Roadmap

- [ ] Connect real LLM generation
- [ ] Brand Memory
- [ ] Persistent campaign history
- [ ] Export to Markdown/CSV
- [ ] Real quality evaluation
- [ ] Authentication and team workspaces
