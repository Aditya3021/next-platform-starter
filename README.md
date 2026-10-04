# InvestView — Hack on Track 2026

A FinTech prototype for **Hack on Track 2026 · FCRIT Vashi**.

## Problem
Retail investors may have holdings spread across multiple brokers/depositories, while alternatives such as REITs, InvITs and bonds can be difficult to understand.

## Solution
InvestView provides:
- One consolidated portfolio view across demo sources
- Asset-type filtering
- Plain-language explainers for REITs, InvITs, bonds and equities
- Explicit risk context
- A safety-first UX that avoids buy/sell recommendations

## Hackathon alignment
**Track:** FinTech — “All your investments, in one place”

The organiser asks for a consolidated holdings view and jargon-free explanations of REITs, InvITs and bonds. Round 1 submissions close **10 October 2026, 11:59 PM IST**; shortlisted teams attend the 24-hour offline round at FCRIT Vashi on **15–16 October 2026**.

## Demo
This branch uses realistic demo holdings. No broker credentials, OTPs or financial-account access are collected.

## Run
```bash
npm install
npm run dev
```

## Roadmap
1. CSV/PDF statement import with local parsing.
2. Normalized holdings schema for multiple brokers/depositories.
3. Source-level reconciliation and duplicate detection.
4. Multilingual explainers.
5. Read-only official integrations where permitted.
6. Accessibility and audit trail.

## Disclaimer
Educational prototype only. It is not investment advice and does not recommend buying, selling or holding any security.
