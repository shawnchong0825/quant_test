"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { id: 'overview', label: 'Overview', keys: 'g o', path: '/' },
        { id: 'research', label: 'Research', keys: 'g r', path: '/research' },
        { id: 'signals', label: 'Signals', keys: 'g s', path: '/signals' },
        { id: 'lab', label: 'Lab', keys: 'g l', path: '/lab' },
        { id: 'execution', label: 'Execution', keys: 'g e', path: '/execution' },
        { id: 'portfolio', label: 'Portfolio', keys: 'g p', path: '/portfolio' },
        { id: 'alerts', label: 'Alerts', keys: 'g a', path: '/alerts' },
        { id: 'settings', label: 'Settings', keys: 'g t', path: '/settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brandTop">
                    <div className="brandName mono">MIQ<span className="sep">/</span>MEME INTEL<span className="sep">/</span><span className="dim">QUANT</span></div>
                    <span className="pill pillOk mono">PROTO</span>
                </div>
                <div className="brandMeta">
                    <div className="kv"><span className="dim">MODE</span><strong className="mono">PAPER</strong></div>
                    <div className="kv"><span className="dim">RISK</span><strong className="mono">ON</strong></div>
                    <div className="kv"><span className="dim">RUNS</span><strong className="mono">3</strong></div>
                </div>
                <div className="brandHint"><span className="dim">Cmd/Ctrl</span>+<span className="mono">K</span> palette · <span className="mono">/</span> search · <span className="mono">?</span> help</div>
            </div>

            <nav className="nav">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={`navItem ${pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="navDot"></span>
                        <span>{item.label}</span>
                        <span className="navKey mono">{item.keys}</span>
                    </Link>
                ))}
            </nav>

            <section className="launcher">
                <div className="sectionHead">
                    <div className="sectionTitle small">JOB LAUNCHER<span className="sep">/</span><span className="dim">scans</span></div>
                    <button className="btn btnGhost mono">QUEUE</button>
                </div>
                <div className="launcherGrid">
                    <button className="btn btnAccent"><span className="mono">▶</span> Fresh Memes <span className="dim small">new tickers</span></button>
                    <button className="btn btnGhost"><span className="mono">▶</span> Whale Watch <span className="dim small">accumulators</span></button>
                    <button className="btn btnGhost"><span className="mono">▶</span> Narrative Shift <span className="dim small">what changed</span></button>
                    <button className="btn btnGhost"><span className="mono">▶</span> Source Sweep <span className="dim small">novelty rank</span></button>
                </div>

                <div className="miniPanel">
                    <div className="miniRow"><span className="dim">Next scheduled</span><strong className="mono">Whale Watch</strong><span className="pill pillWarn mono">in 07m</span></div>
                    <div className="miniRow"><span className="dim">Model</span><strong className="mono">Extractor</strong><span className="pill pillOk mono">ready</span></div>
                    <div className="miniRow"><span className="dim">Connector</span><strong className="mono">gmgn.ai</strong><span className="pill pillOk mono">paper</span></div>
                </div>

                <div className="disclaimer"><span className="pill pillBad mono">NOTE</span> Prototype UI only. Paper-trade first. Use kill-switches & audit logs.</div>
            </section>
        </aside>
    );
}
