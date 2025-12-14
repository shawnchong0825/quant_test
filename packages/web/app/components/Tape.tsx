"use client";
import React from 'react';

export function Tape() {
    const events = [
        { time: "09:12", tag: "SYS", msg: "view → overview", kind: "info" },
        // In a real app this would store a list of recent events
        { time: "09:11", tag: "SCAN", msg: "Fresh Memes", kind: "ok" },
        { time: "09:11", tag: "LOG", msg: "Pipeline graph focused", kind: "info" },
    ];

    return (
        <footer className="tape">
            <div className="tapeLeft"><span className="mono dim">TAPE</span><span className="sep">/</span><span className="dim">events</span><button className="btn btnGhost mono" id="clearTapeBtn">CLEAR</button></div>
            <div className="tapeTrack" id="tapeTrack" tabIndex={0}>
                {/* Render mock events for visual fidelity */}
                <div className="tapeItem"><span className="mono dim">09:12</span><span className="tag">SYS</span><span className="dim">view → overview</span></div>
                <div className="tapeItem"><span className="mono dim">09:11</span><span className="tag ok">SCAN</span><span className="dim">Fresh Memes</span></div>
            </div>
        </footer>
    );
}
