import { prisma } from '@meme-lord/shared';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tokens = await prisma.token.findMany({
    take: 10,
    include: {
      sentiment: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const narratives = await prisma.narrative.findMany({
    take: 5,
    orderBy: { mentions: 'desc' },
    where: { status: 'active' }
  });

  return (
    <>
      <div className="grid">

        {/* Daily Brief */}
        <section className="panel span-12">
          <div className="panelHead">
            <div>
              <div className="panelTitle mono">DAILY BRIEF</div>
              <div className="panelSub dim">Scan changes + high impact events</div>
            </div>
            <div className="panelTools">
              <span className="chip"><span className="dim">FRESH</span><strong className="mono">12m</strong></span>
              <span className="chip"><span className="dim">SOURCES</span><strong className="mono">143</strong></span>
            </div>
          </div>

          <div className="grid">
            <div className="panelInset span-3">
              <div className="dim small">Narratives</div>
              <div className="text-xl font-bold mt-1">7</div>
              <div className="dim small mt-1"><span className="ok">▲</span> +2 vs yesterday</div>
            </div>
            <div className="panelInset span-3">
              <div className="dim small">Confidence</div>
              <div className="text-xl font-bold mt-1">0.68</div>
              <div className="h-1 bg-white/10 mt-2 rounded-full"><div className="h-full bg-cyan-400 w-[68%] rounded-full"></div></div>
            </div>
            <div className="panelInset span-3">
              <div className="dim small">Risk Index</div>
              <div className="text-xl font-bold mt-1">54</div>
              <div className="dim small mt-1"><span className="ok">▲</span> improving</div>
            </div>
            <div className="panelInset span-3">
              <div className="dim small">Execution</div>
              <div className="text-xl font-bold mt-1">OK</div>
              <div className="dim small mt-1">paper trading enabled</div>
            </div>
          </div>
        </section>

        {/* Hot Narratives */}
        <section className="panel span-7">
          <div className="panelHead">
            <div>
              <div className="panelTitle mono">HOT NARRATIVES</div>
              <div className="panelSub dim">Social + on-chain clusters</div>
            </div>
            <button className="btn btnGhost mono">VIEW GRAPH</button>
          </div>

          <div className="flex flex-col gap-2">
            {/* Real Narratives from DB */}
            {narratives.length === 0 ? (
              <div className="panelInset flex items-center justify-center p-4 dim">No narratives active.</div>
            ) : narratives.map(n => (
              <div key={n.id} className="panelInset flex gap-3 items-center">
                <div className="w-24 h-8 bg-black/20 border border-white/5 rounded flex items-center justify-center text-xs dim mono">
                  {n.score > 80 ? 'HIGH' : 'MED'} INT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">“{n.title}”</div>
                  <div className="dim small">{n.description}</div>
                </div>
                <div className="text-right dim mono small">
                  Score {n.score}<br />Vol {n.mentions}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Signals */}
        <section className="panel span-5">
          <div className="panelHead">
            <div>
              <div className="panelTitle mono">TOP SIGNALS</div>
              <div className="panelSub dim">Ranked ideas from Database</div>
            </div>
            <button className="btn btnGhost mono">FILTER</button>
          </div>

          <div className="tableWrap tight">
            <table className="table compact">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Sentiment</th>
                  <th className="right">Status</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                  <tr><td colSpan={3} className="text-center dim p-4">No tokens tracked.</td></tr>
                ) : tokens.map(t => (
                  <tr key={t.id}>
                    <td className="mono font-bold">${t.symbol}</td>
                    <td className="dim text-xs">
                      {t.sentiment[0] ? t.sentiment[0].content?.substring(0, 30) + '...' : '-'}
                    </td>
                    <td className="right">
                      <span className="pill pillOk mono">LIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
}
