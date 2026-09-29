'use client';

import { useMemo, useState } from 'react';

const platforms = ['Instagram', 'YouTube', 'LinkedIn', 'Blog'];

const starterAssets = [
    { day: 1, platform: 'Instagram', type: 'Reel', title: 'The 30-second hook', body: 'Stop scrolling. Your next campaign can start with one idea. Here is how ContentForge turns that idea into a complete content system.', meta: 'Hook • Voiceover • CTA' },
    { day: 2, platform: 'LinkedIn', type: 'Post', title: 'One idea, multiple channels', body: 'Teams lose time adapting the same idea for every channel. ContentForge creates platform-native drafts while keeping the campaign strategy consistent.', meta: 'Professional tone • Lead CTA' },
    { day: 3, platform: 'YouTube', type: 'Short', title: 'From brief to publish-ready', body: 'Give ContentForge a topic, audience and goal. The workflow produces a short-form script, title, description and thumbnail direction.', meta: 'Search title • Script • Thumbnail' },
    { day: 4, platform: 'Blog', type: 'SEO article', title: 'The content workflow playbook', body: 'A practical framework for turning one campaign brief into reusable, channel-specific content without losing the original brand voice.', meta: 'SEO outline • Keywords • Meta' },
];

function buildAssets(topic, audience, goal) {
    const cleanTopic = topic.trim() || 'an AI product launch';
    const cleanAudience = audience.trim() || 'modern creators';
    return starterAssets.map((asset, index) => ({
        ...asset,
        body:
            index === 0
                ? \`Hook: “\${cleanTopic} is changing how \${cleanAudience} create.” Build the story around the problem, the new approach, and one clear next step.\`
                : index === 1
                  ? \`For \${cleanAudience}: \${cleanTopic} becomes a focused campaign rather than a collection of disconnected posts. Primary objective: \${goal.toLowerCase()}.\`
                  : index === 2
                    ? \`Create a fast, practical video explaining \${cleanTopic}. Open with the outcome, show the workflow in three steps, and close with a CTA aligned to \${goal.toLowerCase()}.\`
                    : \`Publish a search-friendly guide about \${cleanTopic}, written for \${cleanAudience}. Structure it around the problem, workflow, examples and measurable next steps.\`,
    }));
}

export default function Page() {
    const [topic, setTopic] = useState('AI-powered fitness app');
    const [audience, setAudience] = useState('college students');
    const [goal, setGoal] = useState('Generate awareness');
    const [selectedPlatforms, setSelectedPlatforms] = useState(platforms.slice(0, 3));
    const [generated, setGenerated] = useState(false);
    const [activeAsset, setActiveAsset] = useState(0);

    const assets = useMemo(() => buildAssets(topic, audience, goal), [topic, audience, goal]);

    function togglePlatform(platform) {
        setSelectedPlatforms((current) =>
            current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
        );
    }

    return (
        <div className="pb-16">
            <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-teal-200">
                        <span className="h-2 w-2 rounded-full bg-teal-300" />
                        Generative Content Workflow
                    </div>
                    <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                        One idea.
                        <span className="block text-teal-300">An entire campaign.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        ContentForge turns a campaign brief into platform-ready content, a publishing plan and an
                        explainable quality check — all inside one workflow.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-300">
                        {['Strategy first', 'Multi-platform', 'Brand consistent', 'Quality feedback'].map((item) => (
                            <span key={item} className="rounded-full bg-white/8 px-3 py-2">{item}</span>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Campaign brief</p>
                            <h2 className="mt-1 text-xl font-bold">Create your workflow</h2>
                        </div>
                        <span className="rounded-full bg-teal-300/10 px-3 py-1 text-xs text-teal-200">MVP</span>
                    </div>

                    <label className="block text-sm font-medium text-slate-200">What are you promoting?</label>
                    <input value={topic} onChange={(event) => setTopic(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none ring-teal-300/30 focus:ring-4" />

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Target audience</label>
                            <input value={audience} onChange={(event) => setAudience(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none ring-teal-300/30 focus:ring-4" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Primary goal</label>
                            <select value={goal} onChange={(event) => setGoal(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none">
                                <option>Generate awareness</option>
                                <option>Generate leads</option>
                                <option>Drive conversions</option>
                                <option>Build community</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-slate-200">Platforms</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {platforms.map((platform) => {
                                const active = selectedPlatforms.includes(platform);
                                return (
                                    <button type="button" key={platform} onClick={() => togglePlatform(platform)}
                                        className={\`rounded-xl border px-3 py-2 text-sm transition \${active ? 'border-teal-300/50 bg-teal-300/10 text-teal-200' : 'border-white/10 bg-white/5 text-slate-400'}\`}>
                                        {active ? '✓ ' : ''}{platform}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="button" onClick={() => { setGenerated(true); setActiveAsset(0); }}
                        className="mt-6 w-full rounded-xl bg-teal-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-teal-200">
                        {generated ? 'Regenerate campaign' : 'Generate campaign'} →
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-500">Prototype workflow — AI provider integration is the next build step.</p>
                </div>
            </section>

            <section className="mt-16">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Workflow output</p>
                        <h2 className="mt-2 text-3xl font-black">Campaign command center</h2>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                        {generated ? '4 assets generated' : 'Ready to generate'}
                    </div>
                </div>

                <div className="mt-7 grid gap-6 lg:grid-cols-[250px_1fr]">
                    <div className="space-y-2">
                        {assets.map((asset, index) => (
                            <button type="button" key={asset.day} onClick={() => setActiveAsset(index)}
                                className={\`w-full rounded-2xl border p-4 text-left transition \${activeAsset === index ? 'border-teal-300/40 bg-teal-300/10' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}\`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day {asset.day}</span>
                                    <span className="text-xs text-teal-200">{asset.platform}</span>
                                </div>
                                <p className="mt-2 font-semibold">{asset.title}</p>
                            </button>
                        ))}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-200">{assets[activeAsset].platform}</span>
                                    <span className="text-xs text-slate-500">{assets[activeAsset].type}</span>
                                </div>
                                <h3 className="mt-3 text-2xl font-bold">{assets[activeAsset].title}</h3>
                            </div>
                            <button type="button" className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">Copy</button>
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-950/60 p-5 text-slate-200">
                            <p className="leading-7">{assets[activeAsset].body}</p>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-slate-500">Quality signals</p>
                                <div className="mt-4 space-y-3">
                                    {[['Hook strength', 82], ['Platform fit', 89], ['CTA clarity', 84]].map(([label, score]) => (
                                        <div key={label}>
                                            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">{label}</span><span>{score}/100</span></div>
                                            <div className="h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-teal-300" style={{ width: \`\${score}%\` }} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-slate-500">Workflow metadata</p>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Audience</span><span>{audience}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Goal</span><span>{goal}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Brand memory</span><span className="text-teal-200">Enabled</span></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">{assets[activeAsset].meta}</p>
                    </div>
                </div>
            </section>

            <section className="mt-16 grid gap-4 sm:grid-cols-3">
                {[['01', 'Understand', 'Strategy agent interprets audience, goal and brand context.'], ['02', 'Generate', 'Platform agents transform the strategy into channel-native assets.'], ['03', 'Improve', 'Quality checks identify weak hooks, CTAs and platform-fit gaps.']].map(([number, title, copy]) => (
                    <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <span className="text-xs font-bold text-teal-300">{number}</span>
                        <h3 className="mt-3 text-lg">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
