'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TopBar() {
    const pathname = usePathname();
    const [clock, setClock] = useState("Loading...");

    useEffect(() => {
        const tick = () => {
            const d = new Date();
            setClock(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + d.toLocaleDateString([], { month: 'short', day: '2-digit' }));
        };
        tick();
        const timer = setInterval(tick, 30000);
        return () => clearInterval(timer);
    }, []);

    const viewName = pathname === '/' ? 'OVERVIEW' : pathname.replace('/', '').toUpperCase();

    return (
        <header className="topbar">
            <div className="topbarLeft">
                <div className="viewTag mono" id="viewTag">{viewName}</div>
                <div className="pulse" id="pulse"></div>
            </div>

            <div className="globalSearch">
                <span className="icon dim">⌕</span>
                <input id="globalSearchInput" placeholder="Search: $TICKER · narrative · wallet · source · contract (press /)" />
                <span className="hint mono dim">/</span>
            </div>

            <div className="topbarRight">
                <button className="chip"><span className="dim">MODE</span><strong className="mono">PAPER</strong></button>
                <button className="chip"><span className="dim">RISK</span><strong className="mono">ON</strong></button>
                <div className="chip"><span className="dim">CONN</span><strong className="mono">1 OK · 1 WARN</strong></div>
                <div className="chip"><span className="dim">MODEL</span><strong className="mono">EXTRACT OK</strong></div>
                <div className="chip mono" id="clockChip">{clock}</div>
                <button className="btn btnGhost onlyMobile" id="intelOpenBtn">INTEL</button>
            </div>

            <div className="searchDrop hidden" id="searchDrop"></div>
        </header>
    );
}
