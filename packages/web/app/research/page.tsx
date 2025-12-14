'use client';

import { useState } from 'react';

export default function ResearchPage() {
    const [digest, setDigest] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const generateDigest = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/research/digest', { method: 'POST' });
            const data = await res.json();
            setDigest(data);
        } catch (e) {
            console.error(e);
            alert('Failed to generate digest');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid">

            {/* Scanner Runs */}
            <section className="panel span-8">
                <div className="panelHead">
                    <div>
                        <div className="panelTitle mono">SCANNER RUNS</div>
                        <div className="panelSub dim">Create repeatable “intel jobs”</div>
                    </div>
                    <div className="panelTools">
                        <span className="chip text-xs">Twitter/X</span>
                        <span className="chip text-xs">Telegram</span>
                        <span className="chip text-xs">On-chain</span>
                    </div>
                </div>

                <div className="grid">
                    <div className="panelInset span-12 flex gap-3 items-center">
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">Fresh Memes (hourly)</div>
                            <div className="dim small">Queries: new tickers + launch keywords</div>
                        </div>
                        <div className="text-right dim mono small">
                            Last: 12m<br /><span className="pill pillOk">running</span>
                        </div>
                    </div>

                    <div className="panelInset span-12 flex gap-3 items-center">
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">Narrative Shift Detector (daily)</div>
                            <div className="dim small">Compare clusters day-over-day</div>
                        </div>
                        <div className="text-right dim mono small">
                            Last: 3h<br /><span className="pill pillGhost">idle</span>
                        </div>
                    </div>
                </div>

                {/* Digest Output */}
                {digest && (
                    <div className="mt-4 p-4 rounded bg-cyan-900/10 border border-cyan-500/20">
                        <h3 className="font-bold text-lg mb-2 text-cyan-400">Morning Digest ☀️</h3>
                        <p className="small dim mb-4">{digest.summary}</p>

                        <div className="flex flex-col gap-6">
                            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <strong className="text-green-400 text-sm uppercase tracking-wide mb-2 block">DeFi</strong>
                                <ul className="list-disc pl-4 small mt-1 space-y-1 dim">
                                    {digest.defi?.map((item: any, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <strong className="text-yellow-400 text-sm uppercase tracking-wide mb-2 block">Narratives</strong>
                                <div className="mt-1 space-y-2">
                                    {digest.narratives?.map((n: any, i: number) => (
                                        <div key={i} className="small bg-black/20 p-2 rounded border border-white/5">
                                            <div className="font-semibold">{n.title} <span className="opacity-50 text-xs">({n.score})</span></div>
                                            <div className="text-xs dim">{n.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <strong className="text-indigo-400 text-sm uppercase tracking-wide mb-2 block">AI</strong>
                                <ul className="list-disc pl-4 small mt-1 space-y-1 dim">
                                    {digest.ai?.map((item: any, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                <strong className="text-green-400 text-sm uppercase tracking-wide mb-2 block">RWA</strong>
                                <ul className="list-disc pl-4 small mt-1 space-y-1 dim">
                                    {digest.rwa?.map((item: any, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Daily Reports Actions */}
            <section className="panel span-4">
                <div className="panelHead">
                    <div>
                        <div className="panelTitle mono">INTELLIGENCE REPORTS</div>
                        <div className="panelSub dim">Digests & Recaps</div>
                    </div>
                    <button className="btn btnGhost mono small">ARCHIVE</button>
                </div>

                <div className="flex flex-col gap-2">
                    {/* Morning Digest Button */}
                    <div
                        onClick={generateDigest}
                        className={`panelInset flex gap-3 items-start cursor-pointer hover:bg-white/5 transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm flex items-center gap-2">
                                Morning Digest ☀️
                                {loading && <span className="text-xs animate-pulse text-cyan-400">Generating...</span>}
                            </div>
                            <div className="dim small mt-1">
                                DeFi, RWA, AI Sector analysis. <br />
                                <i>Status: {digest ? 'Ready' : 'Generate'}</i>
                            </div>
                        </div>
                        <div className="text-right dim mono small">Today</div>
                    </div>

                    <div className="panelInset flex gap-3 items-start cursor-pointer hover:bg-white/5">
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">Sleep Recap 🌙</div>
                            <div className="dim small mt-1">
                                Market moves while you sleep.
                            </div>
                        </div>
                        <div className="text-right dim mono small">Yesterday</div>
                    </div>
                </div>
            </section>

        </div>
    );
}
