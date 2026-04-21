// Flamegraph widget — visualizes one real-ish request through the email pipeline.

function Flamegraph() {
  const trace = window.TRACE;
  if (!trace) return <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--graphite)' }}>no trace data available.</div>;
  const total = trace.totalMs;
  const [hover, setHover] = React.useState(null);

  // Group rows by depth so each "lane" renders horizontally
  const byDepth = {};
  trace.rows.forEach((r, i) => {
    if (!byDepth[r.depth]) byDepth[r.depth] = [];
    byDepth[r.depth].push({ ...r, idx: i });
  });
  const depths = Object.keys(byDepth).sort((a, b) => +a - +b);

  const hovered = hover != null ? trace.rows[hover] : null;

  return (
    <div className="flame-wrap">
      <div className="flame-axis">
        <span>0 ms</span>
        <span>{Math.round(total / 4)}</span>
        <span>{Math.round(total / 2)}</span>
        <span>{Math.round(3 * total / 4)}</span>
        <span>{total} ms</span>
      </div>
      <div className="flame">
        {depths.map(d => (
          <div key={d} className="flame-row">
            {byDepth[d].map(bar => {
              const left = (bar.start / total) * 100;
              const width = ((bar.end - bar.start) / total) * 100;
              const cls = `flame-bar ${bar.kind === 'async' ? 'async' : ''} ${hover === bar.idx ? 'highlight' : ''}`;
              return (
                <div key={bar.idx} className={cls}
                     style={{ left: `${left}%`, width: `${width}%` }}
                     onMouseEnter={() => setHover(bar.idx)}
                     onMouseLeave={() => setHover(null)}
                     title={`${bar.name} — ${bar.end - bar.start} ms`}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bar.name} · {bar.end - bar.start}ms
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flame-summary">
        {hovered ? (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{hovered.name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', letterSpacing: '0.04em' }}>
              DEPTH {hovered.depth} · {hovered.kind.toUpperCase()} · {hovered.end - hovered.start} ms
              {hovered.note ? <> · {hovered.note}</> : null}
            </div>
          </div>
        ) : (
          <div>{trace.summary}</div>
        )}
      </div>
      <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)' }}>
        hover a span for detail · async spans (hatched) don't block the response.
      </div>
    </div>
  );
}

window.Flamegraph = Flamegraph;
