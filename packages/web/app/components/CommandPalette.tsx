"use client";
import React, { useEffect } from 'react';

export function CommandPalette() {
    useEffect(() => {
        // This would handle keyboard shortcut listening for Cmd+K
    }, []);

    return (
        <div className="paletteOverlay hidden" id="paletteOverlay">
            <div className="palette">
                <div className="paletteSearch">
                    <span className="mono dim">_</span>
                    <input placeholder="Type a command..." autoFocus />
                </div>
                <div className="paletteResults">
                    <div className="paletteItem active">
                        <span className="mono">Jump to Overview</span>
                        <span className="mono dim">g o</span>
                    </div>
                    <div className="paletteItem">
                        <span className="mono">Run: Fresh Memes</span>
                        <span className="mono dim">scan</span>
                    </div>
                </div>
                <div className="paletteFooter mono dim">
                    <span>&uarr;&darr; navigate</span>
                    <span>&crarr; select</span>
                    <span>esc close</span>
                </div>
            </div>
        </div>
    );
}
