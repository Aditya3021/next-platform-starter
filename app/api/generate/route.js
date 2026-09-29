const ALLOWED_PLATFORMS = ['Instagram', 'YouTube', 'LinkedIn', 'Blog'];
const fallbackAssets = [
    ['Instagram', 'Reel', 'The 30-second hook'],
    ['LinkedIn', 'Post', 'One idea, multiple channels'],
    ['YouTube', 'Short', 'From brief to publish-ready'],
    ['Blog', 'SEO article', 'The content workflow playbook'],
];

const textValue = (value, fallback, max = 500) => {
    const text = String(value ?? '').trim();
    return (text || fallback).slice(0, max);
};

const clampScore = (value, fallback) => {
    const score = Number(value);
    return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback;
};

function fallback(topic, audience, goal, tone, selectedPlatforms) {
    return selectedPlatforms.slice(0, 7).map((platform, index) => {
        const template = fallbackAssets.find((item) => item[0] === platform) || ['Blog', 'Post', 'Campaign asset'];
        const [, type, title] = template;
        return {
            day: index + 1, platform, type, title, meta: 'Strategy • Platform fit • CTA',
            body: platform === 'Instagram'
                ? 'Hook: “' + topic + ' is changing how ' + audience + ' create.” Build the story around the problem, the new approach, and one clear next step. Tone: ' + tone + '.'
                : platform === 'LinkedIn'
                    ? 'For ' + audience + ': ' + topic + ' becomes a focused campaign rather than disconnected posts. Primary objective: ' + goal.toLowerCase() + '.'
                    : platform === 'YouTube'
                        ? 'Create a fast, practical video explaining ' + topic + '. Open with the outcome, show the workflow in three steps, and close with a CTA aligned to ' + goal.toLowerCase() + '.'
                        : 'Publish a search-friendly guide about ' + topic + ', written for ' + audience + '. Structure it around the problem, workflow, examples and measurable next steps.',
            scores: { hook: 82, fit: 89, cta: 84 },
        };
    });
}

function extractJson(text) {
    const fence = String.fromCharCode(96, 96, 96);
    const cleaned = String(text).split(fence + 'json').join('').split(fence).join('').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('Invalid model response');
    return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request) {
    const body = await request.json().catch(() => ({}));
    const topic = textValue(body.topic, 'an AI product launch');
    const audience = textValue(body.audience, 'modern creators');
    const goal = textValue(body.goal, 'Generate awareness', 120);
    const brand = body.brand && typeof body.brand === 'object' ? body.brand : {};
    const tone = textValue(brand.tone, 'clear and energetic', 160);
    const avoid = textValue(brand.avoid, 'none', 300);
    const requested = Array.isArray(body.platforms) ? body.platforms : [];
    const platforms = [...new Set(requested.filter((item) => ALLOWED_PLATFORMS.includes(item)))].slice(0, 7);
    const selectedPlatforms = platforms.length ? platforms : ['Instagram', 'YouTube', 'LinkedIn'];

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
        return Response.json({
            mode: 'demo',
            strategy: { angle: 'A focused campaign built around one consistent idea.', topic, audience, goal, tone, avoid },
            assets: fallback(topic, audience, goal, tone, selectedPlatforms),
        });
    }

    const prompt = [
        'You are the ContentForge campaign orchestrator.',
        'Create a concise multi-platform campaign from the brief.',
        'Return ONLY valid JSON. No markdown.',
        'Schema: {"strategy":{"angle":"string"},"assets":[{"day":1,"platform":"string","type":"string","title":"string","body":"string","meta":"string","scores":{"hook":0,"fit":0,"cta":0}}]}',
        'Generate exactly one asset for each selected platform, maximum 7 assets.',
        'Scores must be integers from 0 to 100 and reflect the content.',
        'Respect brand tone and avoid instructions.',
        'Brief: ' + JSON.stringify({ topic, audience, goal, brand: { tone, avoid }, platforms: selectedPlatforms }),
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
        if (!response.ok) throw new Error('AI provider request failed');
        const payload = await response.json();
        const parsed = extractJson(payload?.choices?.[0]?.message?.content || '');
        const assets = Array.isArray(parsed.assets) ? parsed.assets.slice(0, 7).map((asset, index) => ({
            ...asset,
            day: index + 1,
            platform: ALLOWED_PLATFORMS.includes(asset.platform) ? asset.platform : selectedPlatforms[index],
            title: textValue(asset.title, 'Campaign asset', 160),
            type: textValue(asset.type, 'Post', 80),
            body: textValue(asset.body, 'Create a platform-native campaign asset.', 4000),
            meta: textValue(asset.meta, 'Strategy • Platform fit • CTA', 200),
            scores: {
                hook: clampScore(asset.scores?.hook, 80),
                fit: clampScore(asset.scores?.fit, 85),
                cta: clampScore(asset.scores?.cta, 82),
            },
        })).filter((asset) => selectedPlatforms.includes(asset.platform)) : [];
        if (!assets.length) throw new Error('No assets returned');
        return Response.json({ mode: 'ai', strategy: parsed.strategy || {}, assets });
    } catch {
        return Response.json({
            mode: 'demo',
            strategy: { angle: 'AI response unavailable; using the reliable local workflow.', topic, audience, goal, tone, avoid },
            assets: fallback(topic, audience, goal, tone, selectedPlatforms),
        });
    }
}
