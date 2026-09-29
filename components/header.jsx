import Link from 'next/link';

export function Header() {
    return (
        <header className="flex items-center justify-between border-b border-white/10 py-5 sm:py-7">
            <Link href="/" className="no-underline">
                <span className="text-xl font-black tracking-tight">Content<span className="text-teal-300">Forge</span> AI</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="hidden sm:inline">PS-02 • Generative Content Workflows</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-teal-200">Hackathon MVP</span>
            </div>
        </header>
    );
}
