# ContentForge AI

> **One idea. An entire campaign.**

ContentForge AI is a hackathon-ready **Generative Content Workflow** that turns one campaign brief into a coordinated, multi-platform content plan.

**PS-02 — Generative Content Workflows**

## 🚀 What it does

Instead of generating isolated posts, ContentForge treats content creation as a workflow:

**Brief → Strategy → Generate → Quality Check → Calendar → Export**

A user enters:
- What they are promoting
- Target audience
- Campaign goal
- Brand tone
- Things to avoid
- Target platforms

ContentForge then creates platform-specific campaign assets and exposes quality signals for each asset.

## ✨ MVP features

| Feature | Status |
|---|---|
| Campaign brief | ✅ |
| Multi-platform generation | ✅ |
| Instagram / YouTube / LinkedIn / Blog | ✅ |
| Brand memory | ✅ |
| Quality signals | ✅ |
| Asset regeneration | ✅ |
| 7-day campaign calendar | ✅ |
| Copy / TXT export | ✅ |
| Browser persistence | ✅ |
| Supabase campaign persistence | ✅ |
| Email/password authentication | ✅ |
| User-scoped campaign history | ✅ |
| Campaign deletion | ✅ |
| Team workspaces | 🔜 |
| Image/video generation | 🔜 |
| Advanced analytics | 🔜 |

## 🧠 Product architecture

```text
                    ┌─────────────────────┐
                    │   Campaign Brief    │
                    │ topic • audience    │
                    │ goal • brand        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Strategy Layer    │
                    │ context + intent    │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │       Generation Engine        │
              │ AI provider / demo fallback    │
              └───────────────┬────────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
        Instagram         YouTube          LinkedIn
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                       ┌──────────────┐
                       │ Quality      │
                       │ Signals      │
                       └──────┬───────┘
                              ▼
                    ┌──────────────────┐
                    │ 7-Day Calendar   │
                    │ + Export         │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Supabase / Local  │
                    │ Campaign History  │
                    └──────────────────┘
```

## 🏗️ Technical stack

- **Frontend:** Next.js 15 App Router + React
- **UI:** Tailwind CSS v4
- **Generation:** OpenAI-compatible API route with demo fallback
- **Authentication:** Supabase Auth
- **Persistence:** Supabase/Postgres + browser localStorage fallback
- **Deployment:** Netlify-compatible Next.js setup

## 📁 Important project structure

```text
app/
├── api/
│   ├── auth/route.js
│   ├── campaigns/route.js
│   ├── campaigns/[id]/route.js
│   └── generate/route.js
├── layout.jsx
└── page.jsx

components/
├── header.jsx
└── footer.jsx

supabase/
└── schema.sql

.env.example
```

## 🔐 Authentication & data isolation

Cloud campaigns are associated with the authenticated Supabase user.

The browser receives an **HttpOnly access-token cookie**. Server routes validate the user before reading, creating, updating, or deleting cloud campaigns.

The Supabase service-role key is used only on the server and must **never** be exposed in client-side code.

## 🤖 AI generation

Without an AI key, ContentForge runs a deterministic demo workflow so the hackathon demo remains usable.

For real generation configure:

```env
AI_API_KEY=
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

The generation route accepts an OpenAI-compatible chat-completions API and asks the model for structured campaign assets.

## ☁️ Supabase setup

Configure:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Then run `supabase/schema.sql` in your Supabase SQL editor.

Enable email/password authentication in your Supabase project before testing sign-up.

## 💻 Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🎬 Recommended demo flow

1. Open ContentForge AI.
2. Enter a campaign idea.
3. Select audience, goal, tone and platforms.
4. Click **Generate campaign**.
5. Open the generated assets.
6. Show the quality signals.
7. Regenerate one weak asset.
8. Show the 7-day publishing calendar.
9. Save the campaign.
10. Sign in and demonstrate campaign history.
11. Load or delete a saved campaign.
12. Export the campaign as TXT.

## 🎯 Why this approach

ContentForge focuses on the **workflow**, not just a text-generation box.

The same campaign context is carried across:
- Strategy
- Platform-specific generation
- Brand constraints
- Quality feedback
- Publishing schedule
- Persistent campaign history

That makes the product demonstrable as an end-to-end generative workflow.

## 🛣️ Roadmap

### Next
- Team workspaces
- Campaign sharing
- Image generation
- CSV / Markdown export
- Better quality evaluation
- Campaign analytics

### Future
- Video generation
- Social publishing integrations
- Approval workflows
- Brand asset libraries
- Usage-based billing
- Organization-level permissions

## ⚠️ Production notes

This branch is a hackathon MVP. Before production:
- Add refresh-token/session rotation.
- Add stronger request validation and rate limiting.
- Add CSRF protection where appropriate.
- Add audit logging.
- Add server-side authorization tests.
- Avoid exposing detailed upstream API errors.
- Add automated tests and CI.

## 📄 License

See the repository's existing license and project terms.
