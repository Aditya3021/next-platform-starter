'use client';

import { useEffect, useMemo, useState } from 'react';

const platforms = ['Instagram', 'YouTube', 'LinkedIn', 'Blog'];
const starterAssets = [
    { day: 1, platform: 'Instagram', type: 'Reel', title: 'The 30-second hook', meta: 'Hook • Voiceover • CTA' },
    { day: 2, platform: 'LinkedIn', type: 'Post', title: 'One idea, multiple channels', meta: 'Professional tone • Lead CTA' },
    { day: 3, platform: 'YouTube', type: 'Short', title: 'From brief to publish-ready', meta: 'Search title • Script • Thumbnail' },
    { day: 4, platform: 'Blog', type: 'SEO article', title: 'The content workflow playbook', meta: 'SEO outline • Keywords • Meta' },
];

function fallbackAssets(topic, audience, goal, brandTone) {
    const cleanTopic = topic.trim() || 'an AI product launch';
    const cleanAudience = audience.trim() || 'modern creators';
    const tone = brandTone.trim() || 'clear and energetic';
    return starterAssets.map((asset, index) => ({
        ...asset,
        body: index === 0
            ? \`Hook: “\${cleanTopic} is changing how \${cleanAudience} create.” Build the story around the problem, the new approach, and one clear next step. Tone: \${tone}.\`
            : index === 1
                ? \`For \${cleanAudience}: \${cleanTopic} becomes a focused campaign rather than disconnected posts. Primary objective: \${goal.toLowerCase()}.\`
                : index === 2
                    ? \`Create a fast, practical video explaining \${cleanTopic}. Open with the outcome, show the workflow in three steps, and close with a CTA aligned to \${goal.toLowerCase()}.\`
                    : \`Publish a search-friendly guide about \${cleanTopic}, written for \${cleanAudience}. Structure it around the problem, workflow, examples and measurable next steps.\`,
        scores: { hook: 82, fit: 89, cta: 84 },
    }));
}

export default function Page() {
    const [topic, setTopic] = useState('AI-powered fitness app');
    const [audience, setAudience] = useState('college students');
    const [goal, setGoal] = useState('Generate awareness');
    const [brandTone, setBrandTone] = useState('Energetic + professional');
    const [avoid, setAvoid] = useState('Overly technical language');
    const [selectedPlatforms, setSelectedPlatforms] = useState(platforms.slice(0, 3));
    const [assets, setAssets] = useState(() => fallbackAssets(topic, audience, goal, brandTone));
    const [generated, setGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Prototype mode');
    const [activeAsset, setActiveAsset] = useState(0);
    const [regenerating, setRegenerating] = useState(false);
    const [saved, setSaved] = useState(false);
    const [campaignId, setCampaignId] = useState(null);
    const [cloudMode, setCloudMode] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authBusy, setAuthBusy] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [strategy, setStrategy] = useState({ angle: 'A focused campaign built around one consistent idea.' });

    useEffect(() => {
        loadAuth();
        loadHistory();
        try {
            const savedCampaign = localStorage.getItem('contentforge-campaign');
            if (!savedCampaign) return;
            const data = JSON.parse(savedCampaign);
            if (data.id) setCampaignId(data.id);
            if (data.topic) setTopic(data.topic);
            if (data.audience) setAudience(data.audience);
            if (data.goal) setGoal(data.goal);
            if (data.brandTone) setBrandTone(data.brandTone);
            if (data.avoid) setAvoid(data.avoid);
            if (Array.isArray(data.selectedPlatforms)) setSelectedPlatforms(data.selectedPlatforms);
            if (data.strategy) setStrategy(data.strategy);
            if (Array.isArray(data.assets) && data.assets.length) setAssets(data.assets);
            if (data.generated) setGenerated(true);
            setStatus('Saved campaign restored');
        } catch {}
    }, []);

    async function saveCampaign(nextAssets = assets) {
        const payload = {
            id: campaignId,
            name: topic || 'Untitled campaign',
            topic, audience, goal, brandTone, avoid,
            selectedPlatforms, assets: nextAssets,
        };
        localStorage.setItem('contentforge-campaign', JSON.stringify({ ...payload, generated: true, savedAt: new Date().toISOString() }));
        try {
            if (!user) { setCloudMode(false); setSaved(true); setTimeout(() => setSaved(false), 1800); return; }
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok && data.campaign?.id) {
                setCampaignId(data.campaign.id);
                setCloudMode(data.mode === 'supabase');
            }
        } catch {}
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    }

    async function loadAuth() {
        try {
            const response = await fetch('/api/auth', { cache: 'no-store' });
            const data = await response.json();
            if (data.authenticated) setUser(data.user);
        } catch {}
    }

    async function authenticate(event) {
        event.preventDefault();
        setAuthBusy(true);
        setAuthMessage('');
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: authMode, email: authEmail, password: authPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Authentication failed');
            if (data.user) {
                setUser(data.user);
                setAuthPassword('');
                setAuthMessage(authMode === 'signup' && data.needsConfirmation ? 'Check your email to confirm your account.' : 'Signed in.');
                loadHistory(data.user);
            } else {
                setAuthMessage('Account created. Check your email if confirmation is enabled.');
            }
        } catch (error) {
            setAuthMessage(error.message);
        } finally {
            setAuthBusy(false);
        }
    }

    async function signOut() {
        await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
        setUser(null);
        setHistory([]);
        setCloudMode(false);
        setStatus('Signed out');
    }

    async function loadHistory(currentUser = user) {
        setHistoryLoading(true);
        try {
            const response = await fetch('/api/campaigns', { cache: 'no-store' });
            const data = await response.json();
            if (response.ok && Array.isArray(data.campaigns)) {
                setHistory(data.campaigns);
                setCloudMode(data.mode === 'supabase');
            }
        } catch {} finally {
            setHistoryLoading(false);
        }
    }

    function loadCampaign(campaign) {
        setCampaignId(campaign.id);
        setTopic(campaign.topic || '');
        setAudience(campaign.audience || '');
        setGoal(campaign.goal || 'Generate awareness');
        setBrandTone(campaign.brand_tone || '');
        setAvoid(campaign.avoid || '');
        setSelectedPlatforms(Array.isArray(campaign.platforms) ? campaign.platforms : platforms.slice(0, 3));
        setAssets(Array.isArray(campaign.assets) && campaign.assets.length ? campaign.assets : fallbackAssets(campaign.topic || '', campaign.audience || '', campaign.goal || '', campaign.brand_tone || ''));
        setGenerated(true);
        setActiveAsset(0);
        setHistoryOpen(false);
        setStatus('Campaign loaded');
        localStorage.setItem('contentforge-campaign', JSON.stringify({
            id: campaign.id, topic: campaign.topic, audience: campaign.audience,
            goal: campaign.goal, brandTone: campaign.brand_tone, avoid: campaign.avoid,
            selectedPlatforms: campaign.platforms, assets: campaign.assets, generated: true,
        }));
    }

    async function deleteCampaign(id) {
        if (!id) return;
        try {
            const response = await fetch('/api/campaigns/' + id, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            setHistory((current) => current.filter((item) => item.id !== id));
            if (campaignId === id) {
                setCampaignId(null);
                setStatus('Campaign deleted');
            }
        } catch {
            setStatus('Could not delete campaign');
        }
    }

    const active = assets[activeAsset] || assets[0];
    const campaignText = useMemo(
        () => assets.map((item) => \`Day \${item.day} — \${item.platform}\\n\${item.title}\\n\${item.body}\`).join('\\n\\n'),
        [assets]
    );

    function togglePlatform(platform) {
        setSelectedPlatforms((current) =>
            current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
        );
    }

    async function generateCampaign() {
        setLoading(true);
        setStatus('Generating workflow…');
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic, audience, goal,
                    brand: { tone: brandTone, avoid },
                    platforms: selectedPlatforms,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Generation failed');
            if (Array.isArray(data.assets) && data.assets.length) setAssets(data.assets);
            setStatus(data.mode === 'ai' ? 'AI workflow generated' : 'Demo workflow generated');
            setGenerated(true);
            setActiveAsset(0);
            saveCampaign(data.assets || assets);
        } catch {
            setStrategy({ angle: 'A focused campaign built from the campaign brief.' });
            setAssets(fallbackAssets(topic, audience, goal, brandTone));
            setStatus('Demo workflow — API unavailable');
            setGenerated(true);
            setActiveAsset(0);
        } finally {
            setLoading(false);
        }
    }

    async function regenerateActiveAsset() {
        if (!active) return;
        setRegenerating(true);
        setStatus('Regenerating asset…');
        try {
            const response = await fetch('/api/generate', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, audience, goal, brand: { tone: brandTone, avoid }, platforms: [active.platform], regenerate: true }),
            });
            const data = await response.json();
            if (!response.ok || !data.assets?.length) throw new Error('Regeneration failed');
            const replacement = { ...data.assets[0], day: active.day };
            const next = assets.map((item, index) => index === activeAsset ? replacement : item);
            setAssets(next);
            saveCampaign(next);
            setStatus(data.mode === 'ai' ? 'Asset regenerated with AI' : 'Asset regenerated in demo mode');
        } catch {
            const next = fallbackAssets(topic, audience, goal, brandTone);
            setAssets(next);
            saveCampaign(next);
            setStatus('Asset regenerated in demo mode');
        } finally { setRegenerating(false); }
    }

    function copyCampaign() {
        navigator.clipboard?.writeText(campaignText);
    }

    function downloadCampaign() {
        const safe = (value) => String(value ?? '').replace(/"/g, '""');
        const rows = [['Day', 'Platform', 'Type', 'Title', 'Body', 'Hook', 'Fit', 'CTA']];
        assets.forEach((item) => rows.push([
            item.day, item.platform, item.type, item.title, item.body,
            item.scores?.hook ?? '', item.scores?.fit ?? '', item.scores?.cta ?? '',
        ]));
        const csv = rows.map((row) => row.map((value) => '"' + safe(value) + '"').join(',')).join('\\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'contentforge-campaign.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function downloadMarkdown() {
        const markdown = '# ' + (topic || 'ContentForge Campaign') + '\\n\\n'
            + '**Audience:** ' + audience + '\\n\\n'
            + '**Goal:** ' + goal + '\\n\\n'
            + '**Strategy:** ' + (strategy.angle || 'Multi-platform campaign workflow') + '\\n\\n'
            + assets.map((item) => '## Day ' + item.day + ' — ' + item.platform + '\\n\\n'
                + '**' + item.type + ':** ' + item.title + '\\n\\n' + item.body + '\\n').join('\\n');
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'contentforge-campaign.md';
        anchor.click();
        URL.revokeObjectURL(url);
    }

        const blob = new Blob([campaignText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'contentforge-campaign.txt';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="pb-16">
            <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-teal-200">
                        <span className="h-2 w-2 rounded-full bg-teal-300" /> Generative Content Workflow
                    </div>
                    <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                        One idea.<span className="block text-teal-300">An entire campaign.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        ContentForge turns a campaign brief into platform-ready content, a publishing plan and an explainable quality check — all inside one workflow.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-300">
                        {['Strategy first', 'Multi-platform', 'Brand memory', 'Quality feedback'].map((item) => (
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
                        <span className="rounded-full bg-teal-300/10 px-3 py-1 text-xs text-teal-200">{cloudMode ? 'Cloud saved' : status}</span>
                    </div>

                    <label className="block text-sm font-medium text-slate-200">What are you promoting?</label>
                    <input value={topic} onChange={(event) => setTopic(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none ring-teal-300/30 focus:ring-4" />

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Target audience</label>
                            <input value={audience} onChange={(event) => setAudience(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Primary goal</label>
                            <select value={goal} onChange={(event) => setGoal(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none">
                                <option>Generate awareness</option><option>Generate leads</option><option>Drive conversions</option><option>Build community</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Brand tone</label>
                            <input value={brandTone} onChange={(event) => setBrandTone(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Avoid</label>
                            <input value={avoid} onChange={(event) => setAvoid(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-slate-200">Platforms</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {platforms.map((platform) => {
                                const activePlatform = selectedPlatforms.includes(platform);
                                return (
                                    <button type="button" key={platform} onClick={() => togglePlatform(platform)}
                                        className={\`rounded-xl border px-3 py-2 text-sm transition \${activePlatform ? 'border-teal-300/50 bg-teal-300/10 text-teal-200' : 'border-white/10 bg-white/5 text-slate-400'}\`}>
                                        {activePlatform ? '✓ ' : ''}{platform}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="button" onClick={generateCampaign} disabled={loading}
                        className="mt-6 w-full rounded-xl bg-teal-300 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-teal-200 disabled:cursor-wait disabled:opacity-60">
                        {loading ? 'Generating…' : generated ? 'Regenerate campaign' : 'Generate campaign'} →
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-500">Set AI_API_KEY on the server to enable real generation; otherwise the demo fallback runs.</p>
                </div>
            </section>

            <section className="mt-16">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Workflow output</p><h2 className="mt-2 text-3xl font-black">Campaign command center</h2></div>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={copyCampaign} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Copy</button>
                        <button type="button" onClick={() => saveCampaign()} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-teal-200 hover:bg-white/10">{saved ? 'Saved' : 'Save campaign'}</button>
                        <button type="button" onClick={downloadCampaign} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Export CSV</button><button type="button" onClick={downloadMarkdown} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Export MD</button>
                    </div>
                </div>

                <div className="mt-7 grid gap-6 lg:grid-cols-[250px_1fr]">
                    <div className="space-y-2">
                        {assets.map((asset, index) => (
                            <button type="button" key={asset.day} onClick={() => setActiveAsset(index)}
                                className={\`w-full rounded-2xl border p-4 text-left transition \${activeAsset === index ? 'border-teal-300/40 bg-teal-300/10' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}\`}>
                                <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day {asset.day}</span><span className="text-xs text-teal-200">{asset.platform}</span></div>
                                <p className="mt-2 font-semibold">{asset.title}</p>
                            </button>
                        ))}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2"><span className="rounded-full bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-200">{active.platform}</span><span className="text-xs text-slate-500">{active.type}</span></div>
                                <h3 className="mt-3 text-2xl font-bold">{active.title}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={regenerateActiveAsset} disabled={regenerating} className="rounded-xl bg-teal-300 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{regenerating ? 'Regenerating…' : 'Regenerate'}</button>
                                <button type="button" onClick={() => navigator.clipboard?.writeText(active.body)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">Copy asset</button>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-950/60 p-5 text-slate-200"><p className="leading-7">{active.body}</p></div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-slate-500">Quality signals</p>
                                <div className="mt-4 space-y-3">
                                    {[['Hook strength', active.scores?.hook ?? 82], ['Platform fit', active.scores?.fit ?? 89], ['CTA clarity', active.scores?.cta ?? 84]].map(([label, score]) => (
                                        <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">{label}</span><span>{score}/100</span></div><div className="h-1.5 rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-teal-300" style={{ width: \`\${score}%\` }} /></div></div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-xs uppercase tracking-wider text-slate-500">Brand memory</p>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between gap-3"><span className="text-slate-500">Tone</span><span className="text-right">{brandTone}</span></div>
                                    <div className="flex justify-between gap-3"><span className="text-slate-500">Avoid</span><span className="text-right">{avoid}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Goal</span><span>{goal}</span></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">{active.meta}</p>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Workspace identity</p>
                            <h2 className="mt-2 text-2xl font-black">{user ? 'Signed-in workspace' : 'Sign in for cloud campaigns'}</h2>
                            <p className="mt-1 text-sm text-slate-500">{user ? user.email : 'Your campaigns are scoped to your authenticated account.'}</p>
                        </div>
                        {user && <button type="button" onClick={signOut} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Sign out</button>}
                    </div>
                    {!user && (
                        <form onSubmit={authenticate} className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                            <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
                            <input type="password" required minLength={6} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password (6+ characters)" className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" />
                            <button type="submit" disabled={authBusy} className="rounded-xl bg-teal-300 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{authBusy ? 'Working…' : authMode === 'login' ? 'Sign in' : 'Create account'}</button>
                        </form>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {!user && <button type="button" onClick={() => setAuthMode((mode) => mode === 'login' ? 'signup' : 'login')} className="text-teal-200 hover:underline">{authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}</button>}
                        {authMessage && <span>{authMessage}</span>}
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Campaign workspace</p>
                            <h2 className="mt-2 text-2xl font-black">Saved campaigns</h2>
                            <p className="mt-1 text-sm text-slate-500">Load previous campaigns, continue editing, or remove old drafts.</p>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => { setHistoryOpen((value) => !value); if (!historyOpen) loadHistory(); }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                                {historyOpen ? 'Hide history' : 'Open history'} {history.length ? '(' + history.length + ')' : ''}
                            </button>
                            <button type="button" onClick={loadHistory} disabled={historyLoading} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-teal-200 disabled:opacity-50">
                                {historyLoading ? 'Refreshing…' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                    {historyOpen && (
                        <div className="mt-5 space-y-2">
                            {!historyLoading && !history.length && (
                                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                                    No cloud campaigns yet. Save a campaign to build your history.
                                </div>
                            )}
                            {history.map((campaign) => (
                                <div key={campaign.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button type="button" onClick={() => loadCampaign(campaign)} className="min-w-0 text-left">
                                        <p className="truncate font-semibold text-white">{campaign.name || campaign.topic || 'Untitled campaign'}</p>
                                        <p className="mt-1 text-xs text-slate-500">{campaign.audience || 'No audience'} · {campaign.goal || 'No goal'} · {Array.isArray(campaign.assets) ? campaign.assets.length : 0} assets</p>
                                    </button>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-xs text-slate-600">{campaign.updated_at ? new Date(campaign.updated_at).toLocaleDateString() : ''}</span>
                                        <button type="button" onClick={() => loadCampaign(campaign)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-teal-200 hover:bg-white/5">Load</button>
                                        <button type="button" onClick={() => deleteCampaign(campaign.id)} className="rounded-lg border border-red-300/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-300/10">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Assets</p><p className="mt-2 text-3xl font-black">{assets.length}</p><p className="mt-1 text-xs text-slate-500">platform-ready pieces</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Platforms</p><p className="mt-2 text-3xl font-black">{new Set(assets.map((item) => item.platform)).size}</p><p className="mt-1 text-xs text-slate-500">channels covered</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Avg quality</p><p className="mt-2 text-3xl font-black">{assets.length ? Math.round(assets.reduce((sum, item) => sum + (Number(item.scores?.hook ?? 0) + Number(item.scores?.fit ?? 0) + Number(item.scores?.cta ?? 0)) / 3, 0) / assets.length) : 0}<span className="text-base text-slate-500">/100</span></p><p className="mt-1 text-xs text-slate-500">across quality signals</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Strategy</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{strategy.angle}</p></div>
                </div>
            </section>

            <section className="mt-16">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Publishing calendar</p><h2 className="mt-2 text-3xl font-black">7-day campaign runway</h2></div>
                        <span className="text-sm text-slate-500">Drag-free MVP calendar</span>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 7 }, (_, index) => {
                            const asset = assets[index % assets.length];
                            return <button type="button" key={index} onClick={() => setActiveAsset(index % assets.length)} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left hover:border-teal-300/30">
                                <p className="text-xs font-bold text-teal-300">DAY {index + 1}</p>
                                <p className="mt-2 font-semibold">{asset?.platform || 'Content'}</p>
                                <p className="mt-1 text-sm text-slate-400">{asset?.title || 'Campaign asset'}</p>
                            </button>;
                        })}
                    </div>
                </div>
            </section>

            <section className="mt-16 grid gap-4 sm:grid-cols-3">
                {[['01', 'Understand', 'Strategy interprets audience, goal and brand context.'], ['02', 'Generate', 'Platform workflows transform strategy into channel-native assets.'], ['03', 'Improve', 'Quality checks surface weak hooks, CTAs and platform-fit gaps.']].map(([number, title, copy]) => (
                    <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="text-xs font-bold text-teal-300">{number}</span><h3 className="mt-3 text-lg">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div>
                ))}
            </section>
        </div>
    );
}
