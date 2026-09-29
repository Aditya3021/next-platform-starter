const fallbackAssets = [
    ['Instagram', 'Reel', 'The 30-second hook'],
    ['LinkedIn', 'Post', 'One idea, multiple channels'],
    ['YouTube', 'Short', 'From brief to publish-ready'],
    ['Blog', 'SEO article', 'The content workflow playbook'],
];

function fallback(topic, audience, goal, tone) {
    return fallbackAssets.map(([platform, type, title], index) => ({
        day: index + 1, platform, type, title, meta: 'Strategy • Platform fit • CTA',
        body: index === 0
            ? 'Hook: “' + topic + ' is changing how ' + audience + ' create.” Build the story around the problem, the new approach, and one clear next step. Tone: ' + tone + '.'
            : index === 1
                ? 'For ' + audience + ': ' + topic + ' becomes a focused campaign rather than disconnected posts. Primary objective: ' + goal.toLowerCase() + '.'
                : index === 2
                    ? 'Create a fast, practical video explaining ' + topic + '. Open with the outcome, show the workflow in three steps, and close with a CTA aligned to ' + goal.toLowerCase() + '.'
                    : 'Publish a search-friendly guide about ' + topic + ', written for ' + audience + '. Structure it around the problem, workflow, examples and measurable next steps.',
        scores: { hook: 82, fit: 89, cta: 84 },
    }));
}

function extractJson(text) {
    const cleaned = text.replace(/\\\`\\\`\\\`json/gi, '').replace(/\\\`\\\`\\\`/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request) {
    const body = await request.json().catch(() => ({}));
    const topic = body.topic || 'an AI product launch';
    const audience = body.audience || 'modern creators';
    const goal = body.goal || 'Generate awareness';
    const brand = body.brand || {};
    const tone = brand.tone || 'clear and energetic';
    const platforms = Array.isArray(body.platforms) && body.platforms.length ? body.platforms : ['Instagram', 'YouTube', 'LinkedIn'];

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
        return Response.json({ mode: 'demo', strategy: { topic, audience, goal, tone }, assets: fallback(topic, audience, goal, tone) });
    }

    const prompt = [
        'You are the ContentForge campaign orchestrator.',
        'Create a concise multi-platform campaign from the brief.',
        'Return ONLY valid JSON. No markdown.',
        'Schema: {"strategy":{"angle":"string"},"assets":[{"day":1,"platform":"string","type":"string","title":"string","body":"string","meta":"string","scores":{"hook":0,"fit":0,"cta":0}}]}',
        'Generate exactly one asset for each selected platform, maximum 7 assets.',
        'Scores must be integers from 0 to 100 and should reflect the content.',
        'Brief: ' + JSON.stringify({ topic, audience, goal, brand, platforms }),
    ].join('\\n');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
            body: JSON.stringify({
                model, temperature: 0.7,
                messages: [
                    { role: 'system', content: 'You generate structured marketing workflows and obey JSON-only output.' },
                    { role: 'user', content: prompt },
                ],
            }),
        });
        if (!response.ok) return Response.json({ error: 'AI provider request failed' }, { status: 502 });
        const payload = await response.json();
        const parsed = extractJson(payload?.choices?.[0]?.message?.content || '');
        const assets = Array.isArray(parsed.assets) ? parsed.assets.map((asset, index) => ({
            ...asset, day: asset.day || index + 1,
            scores: { hook: Number(asset.scores?.hook ?? 80), fit: Number(asset.scores?.fit ?? 85), cta: Number(asset.scores?.cta ?? 82) },
        })) : [];
        if (!assets.length) throw new Error('No assets returned');
        return Response.json({ mode: 'ai', strategy: parsed.strategy || {}, assets });
    } catch (error) {
        return Response.json({ error: 'Could not parse AI workflow', details: error.message }, { status: 502 });
    }
}
