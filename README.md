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
- [x] Supabase email authentication and user-scoped campaign workspaces


## Demo persistence

The MVP stores the latest campaign in browser localStorage so a refresh can restore the workflow without requiring a database. This is intentionally client-side for the hackathon prototype; production persistence should move to Supabase/Postgres behind authentication.

## Optional cloud persistence

For a hackathon/demo deployment, the app works with browser storage by default. To enable server-side campaign persistence, create the `campaigns` table using `supabase/schema.sql` and configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key is used only by the server route and must never be exposed to the client.

## Authentication

The MVP now supports Supabase email/password sign-in. Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`, then run the updated `supabase/schema.sql`. Authentication uses an HttpOnly access-token cookie; campaign reads, saves, and deletes are scoped to the signed-in Supabase user. The service-role key remains server-only.
