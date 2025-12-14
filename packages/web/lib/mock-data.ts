export const MOCK_DATA = {
    heatmap: {
        rows: ["Agents", "Celebrity", "Airdrop", "Copycats", "Infra", "Sol micro", "Eth micro", "Other"],
        cols: ["$MEME", "$BOT", "$DOGE2", "$CAT", "$STAR", "$BEE", "$MOON", "$WOW"],
        // score: -1..+1 (color)
        matrix: [
            [.72, .18, .34, .52, .12, -.10, -.18, .05],
            [.28, .08, .58, .07, .66, .12, -.08, .04],
            [.11, -.04, .09, .22, .05, .02, .00, .01],
            [.07, .12, -.09, .18, .02, .04, .05, -.02],
            [.41, .26, .10, .33, .17, .03, -.06, .00],
            [.54, .13, .19, .08, .11, .06, .02, .03],
            [.12, .05, .23, .04, .07, .01, .03, .02],
            [.06, .02, .03, .01, .02, .01, .00, .00],
        ]
    },

    movers: [
        { t: "09:12", ev: "Narrative ↑", a: "$MEME", impact: "+2.8", conf: 0.71 },
        { t: "09:10", ev: "Whale buy", a: "$MEME", impact: "+1.2", conf: 0.69 },
        { t: "09:06", ev: "Vol anomaly", a: "$DOGE2", impact: "+0.9", conf: 0.58 },
        { t: "08:59", ev: "Listing rumor", a: "$STAR", impact: "+1.7", conf: 0.64 },
        { t: "08:52", ev: "Copycat alert", a: "$CAT", impact: "-0.6", conf: 0.52 },
    ],

    runs: Array.from({ length: 10 }, (_, i) => ({
        id: `run_${(1000 + i)}`,
        time: `${String(9 - Math.floor(i / 2)).padStart(2, "0")}:${String(59 - (i * 3) % 60).padStart(2, "0")}`,
        sources: 120 - i * 3,
        dedupe: (0.18 + i * 0.01).toFixed(2),
        novelty: (0.60 - i * 0.01).toFixed(2),
        clusters: 7 - (i % 3),
        errors: (i % 4 === 0) ? 1 : 0,
        dur: `${6 + (i % 4)}m`
    })),

    topSignals: [
        {
            id: "s1", asset: "$MEME", chain: "SOL", conf: 0.71, fresh: "12m", rr: 2.1, cat: 0.78, liq: 0.42, ev: 3,
            feat: [["narrativeMomentum", +0.18], ["walletOverlap", +0.12], ["volumeAnomaly", +0.09], ["novelty", +0.07], ["riskPenalty", -0.05]],
            prov: [["X thread", "0.82", "9m"], ["Telegram", "0.71", "14m"], ["On-chain", "0.65", "28m"]]
        },
        {
            id: "s2", asset: "$DOGE2", chain: "ETH", conf: 0.58, fresh: "29m", rr: 1.6, cat: 0.42, liq: 0.63, ev: 2,
            feat: [["exhaustion", +0.11], ["meanRevert", +0.08], ["spreadPenalty", -0.06], ["trend", -0.03], ["novelty", +0.04]],
            prov: [["On-chain", "0.67", "29m"], ["X mentions", "0.63", "33m"]]
        },
        {
            id: "s3", asset: "$CAT", chain: "SOL", conf: 0.52, fresh: "44m", rr: 1.3, cat: 0.31, liq: 0.38, ev: 1,
            feat: [["hype", +0.06], ["novelty", +0.03], ["evidenceCount", -0.05]],
            prov: [["Reddit", "0.58", "39m"]]
        }
    ],

    connectors: [
        { name: "gmgn.ai", latency: "120ms", lastErr: "—", retry: 0, status: "CONNECTED" },
        { name: "anyex.ai", latency: "—", lastErr: "missing key", retry: 3, status: "NEEDS KEY" }
    ],

    railsOutcome: [
        ["Slippage", "PASS", "0.22% ≤ 0.5% cap"],
        ["Liquidity", "PASS", ">$50k est."],
        ["Drawdown", "PASS", "daily -3% not hit"],
        ["Connector", "WARN", "anyex disabled"],
    ],

    audit: [
        ["09:12", "MODEL", "Extractor ran: 143 sources · 21 deduped · 7 clusters"],
        ["09:11", "MODEL", "Signal scoring complete"],
        ["09:10", "RAILS", "Kill-switch armed (-3%)"],
        ["09:08", "CONN", "gmgn.ai connected (paper)"],
        ["09:06", "CONN", "anyex.ai missing key (disabled)"],
    ],

    positions: [
        { asset: "$MEME", narrative: "Agents", size: "S", pnl: "+2.1%", risk: "liq-limited" },
        { asset: "$DOGE2", narrative: "Celebrity v2", size: "XS", pnl: "-0.6%", risk: "regime" },
        { asset: "$CAT", narrative: "Breakout", size: "WATCH", pnl: "+0.0%", risk: "hype" },
    ],
    exposure: {
        chains: [["SOL", "62%"], ["ETH", "28%"], ["Other", "10%"]],
        narrs: [["Agents", "41%"], ["Celebrity", "23%"], ["Airdrop", "11%"], ["Other", "25%"]],
        rails: [["Max daily DD", "-3.0%"], ["Max pos", "S"], ["Slippage cap", "0.5%"], ["Min liq", "$50k"]]
    },
    journal: [
        ["Today", "Add only if route preview <0.5% slip; reduce size on spread spikes."],
        ["Yesterday", "Provenance gating: ≥2 independent sources + on-chain confirm."],
    ],
    alerts: {
        rules: [
            ["Narrative enters top 3", "conf ≥ 0.65 · cooldown 60m", true],
            ["Whale accumulator triggers", "≥ 3 labeled buys in 30m", true],
            ["Slippage regime change", "median slip > 0.6% for 10m", false],
        ],
        triggered: [
            ["AI Agents → top 3", "18m"],
            ["Wallet cluster buy on $MEME", "46m"],
        ],
        digest: "• Top narrative: AI Agents (0.74, Δ24h +0.18)\n• Top signal: $MEME (0.71, fresh 12m)\n• Watchlist: 3 assets > +2% since last scan\n• System: anyex needs key; gmgn paper OK\n"
    },
    settings: {
        keys: [["gmgn.ai", "Key: ●●●●●●● (masked) · trade (paper)", "OK"], ["anyex.ai", "Key missing · add to enable", "WARN"]],
        rails: [["Kill-switch", "-3% daily DD or conn errors", "ON"], ["Slippage cap", "reject > 0.5%", "0.5%"], ["Liquidity min", "skip illiquid", "ON"], ["Rate limit guard", "backoff + queue", "ON"]],
        sources: "Sources: X / Telegram / Reddit / On-chain\nDedupe: simhash + canonicalization\nClustering: embedding + temporal decay + overlap\nEval: weekly drift checks"
    }
};
