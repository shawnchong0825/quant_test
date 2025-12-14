"use client";
import React from 'react';

export function RightRail() {
    return (
        <aside className="rail" id="rail">
            <div className="railHead"><div className="railTitle mono">INTEL RAIL</div><div className="railMeta dim">watchlist · alerts · system · context</div></div>

            <section className="railPanel">
                <div className="railPanelHead"><span className="mono dim">WATCHLIST</span><span className="pill pillGhost mono" id="watchCount">3</span></div>
                <div className="tableWrap tight">
                    <table className="table compact">
                        <thead><tr><th>Asset</th><th className="right">Chg</th><th className="right">Conf</th></tr></thead>
                        <tbody id="watchlist">
                            <tr><td className="mono">$MEME</td><td className="right mono pos">+3.2%</td><td className="right"><span className="pill pillOk mono">0.71</span></td></tr>
                            <tr><td className="mono">$DOGE2</td><td className="right mono neg">-0.4%</td><td className="right"><span className="pill pillWarn mono">0.58</span></td></tr>
                            <tr><td className="mono">$CAT</td><td className="right mono pos">+0.8%</td><td className="right"><span className="pill pillWarn mono">0.52</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="railPanel">
                <div className="railPanelHead"><span className="mono dim">ALERTS</span><span className="pill pillGhost mono" id="railAlertCount">2</span></div>
                <div className="tableWrap tight">
                    <table className="table compact">
                        <thead><tr><th>Title</th><th className="right">Age</th></tr></thead>
                        <tbody id="railAlerts">
                            <tr><td className="mono">AI Agents → top 3</td><td className="right mono">18m</td></tr>
                            <tr><td className="mono">Wallet cluster buy</td><td className="right mono">46m</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="railPanel">
                <div className="railPanelHead"><span className="mono dim">SYSTEM</span><span className="pill pillWarn mono" id="sysWarn">warn</span></div>
                <div className="tableWrap tight">
                    <table className="table compact">
                        <thead><tr><th>Metric</th><th className="right">Value</th></tr></thead>
                        <tbody id="sysTable">
                            <tr><td className="mono">Connectors</td><td className="right mono">gmgn OK · anyex WARN</td></tr>
                            <tr><td className="mono">Rate limit</td><td className="right mono">OK</td></tr>
                            <tr><td className="mono">Queue depth</td><td className="right mono">2</td></tr>
                            <tr><td className="mono">Model drift</td><td className="right mono">low</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="railPanel">
                <div className="railPanelHead"><span className="mono dim">SELECTED CONTEXT</span><span className="pill pillGhost mono" id="contextTag">none</span></div>
                <div className="context" id="context">
                    Click a signal or asset to see context details...
                </div>
            </section>
        </aside>
    );
}
