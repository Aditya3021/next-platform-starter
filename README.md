# LearnForge — ForgeHacks 2026

**Track:** AI + Education

LearnForge is an adaptive learning companion designed to help students move beyond memorization. A learner asks a natural-language question; a lightweight semantic retrieval layer identifies the most relevant concept, returns a concise explanation, and generates a targeted micro-quiz for application and recall.

## Why it fits ForgeHacks
ForgeHacks asks for an AI-powered solution that helps learners understand concepts, make connections, and apply their knowledge. LearnForge focuses on the loop **ask → explain → test → reinforce**.

## AI / technical approach
- Token-based semantic similarity ranks curriculum concepts against the learner query.
- Concept metadata provides transparent retrieval context instead of a black-box answer.
- Adaptive micro-quizzes target the selected concept.
- Architecture is intentionally replaceable: the local retrieval layer can later be backed by embeddings/vector search and a hosted LLM.

## Demo
1. Ask: "Why is hash lookup usually fast?"
2. Click **Explain with LearnForge**.
3. Generate a micro-quiz.
4. Answer and see the learning loop.

## Run
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Hackathon compliance
This project was created for ForgeHacks 2026 during the event period. Open-source libraries and AI coding assistants are permitted by the official rules. One team submission is required; the public repository and 2–4 minute demo video are required for eligibility.

## Safety / privacy
The prototype uses local demo curriculum and does not collect student credentials or sensitive personal information. It is an educational aid, not a replacement for teachers or institutional assessment.

## Credits
Built by Aditya Barate for ForgeHacks Online 2026.
