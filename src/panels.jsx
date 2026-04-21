// Detail panels rendered in the drawer for each node.

function ProsePanel({ data }) {
  return (
    <div>
      {data.sections.map((s, i) => {
        if (s.kind === "prose") return <p key={i} dangerouslySetInnerHTML={{ __html: s.body }} />;
        if (s.kind === "stack") {
          return (
            <React.Fragment key={i}>
              <h3>Stack</h3>
              <dl className="stack">
                {s.entries.map(([k, v], j) => (
                  <React.Fragment key={j}>
                    <dt>{k}</dt><dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </React.Fragment>
          );
        }
        if (s.kind === "education") {
          return (
            <React.Fragment key={i}>
              <h3>Education</h3>
              {s.entries.map((e, j) => (
                <div key={j} style={{
                  borderTop: j === 0 ? 'none' : '1px solid var(--rule)',
                  padding: j === 0 ? '0 0 10px' : '10px 0',
                }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>
                    {e.degree}
                    {e.honors && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--graphite)', marginLeft: 10, verticalAlign: 2 }}>
                        · {e.honors}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--graphite)', letterSpacing: '0.02em', marginTop: 2 }}>
                    {e.school}
                  </div>
                </div>
              ))}
            </React.Fragment>
          );
        }
        return null;
      })}
    </div>
  );
}

function ExperiencePanel({ data, openFlame }) {
  return (
    <div>
      {data.roles.map((r, i) => (
        <div key={i} className="role">
          <div className="role-head">
            <div>
              <div className="company">{r.company}</div>
              <div className="title">{r.title}</div>
            </div>
            <div className="dates">{r.dates}</div>
          </div>
          <div className="context">{r.context}</div>
          <ul>
            {r.bullets.map((b, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: b }} />
            ))}
          </ul>
          {r.trace && (
            <div style={{ marginTop: 10 }}>
              <button className="term-chip" onClick={openFlame} style={{ borderColor: 'var(--ink)' }}>
                ↗ trace one request through this pipeline
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel({ data }) {
  return (
    <div>
      {data.items.map((p, i) => (
        <div key={i} className="project">
          <div className="pname">{p.name}</div>
          <div className="pmeta">{p.meta}</div>
          {p.body.map((t, j) => <p key={j} dangerouslySetInnerHTML={{ __html: t }} />)}
          <div className="ptags">
            {p.tags.map((t, j) => <span key={j}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemsPanel({ data }) {
  return (
    <div>
      <p style={{ marginBottom: 18 }}>{data.prose}</p>
      {data.diagrams.map((d, i) => (
        <div key={i} style={{ borderTop: '1px solid var(--rule)', padding: '16px 0' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{d.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', letterSpacing: '0.04em', marginBottom: 8 }}>
            USE · {d.use}
          </div>
          <p style={{ color: 'var(--ink-2)' }}>{d.shape}</p>
          <MiniDiagram kind={i} />
        </div>
      ))}
    </div>
  );
}

// Tiny inline diagrams for each system shape — rendered as SVG, blueprint style.
function MiniDiagram({ kind }) {
  const W = 600, H = 140;
  const boxProps = { fill: 'var(--paper)', stroke: 'var(--ink)', strokeWidth: 1 };
  const textProps = { fontFamily: 'var(--mono)', fontSize: 10, fill: 'var(--ink)', textAnchor: 'middle' };
  const edgeProps = { stroke: 'var(--graphite)', strokeWidth: 1, fill: 'none' };
  const edgeDash = { ...edgeProps, strokeDasharray: '3 3' };

  const common = (
    <defs>
      <marker id={`mini-arrow-${kind}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
        <path d="M 0 0 L 5 3 L 0 6 z" fill="var(--graphite)" />
      </marker>
    </defs>
  );

  if (kind === 0) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, marginTop: 10 }}>
        {common}
        <rect x="20" y="55" width="80" height="34" {...boxProps} />
        <text {...textProps} x="60" y="76">source</text>
        <rect x="160" y="55" width="80" height="34" {...boxProps} />
        <text {...textProps} x="200" y="76">queue</text>
        <rect x="300" y="55" width="80" height="34" {...boxProps} />
        <text {...textProps} x="340" y="76">router</text>
        <rect x="450" y="20" width="110" height="28" {...boxProps} />
        <text {...textProps} x="505" y="38">tenant.topic.A</text>
        <rect x="450" y="60" width="110" height="28" {...boxProps} />
        <text {...textProps} x="505" y="78">tenant.topic.B</text>
        <rect x="450" y="100" width="110" height="28" {...boxProps} />
        <text {...textProps} x="505" y="118">tenant.topic.C</text>
        <line x1="100" y1="72" x2="160" y2="72" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
        <line x1="240" y1="72" x2="300" y2="72" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 380 72 L 410 72 L 410 34 L 450 34" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 380 72 L 450 72" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 380 72 L 410 72 L 410 114 L 450 114" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
      </svg>
    );
  }

  if (kind === 1) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, marginTop: 10 }}>
        {common}
        <rect x="20" y="55" width="90" height="34" {...boxProps} />
        <text {...textProps} x="65" y="76">mongo</text>
        <rect x="170" y="55" width="100" height="34" {...boxProps} />
        <text {...textProps} x="220" y="76">change stream</text>
        <rect x="330" y="55" width="90" height="34" {...boxProps} />
        <text {...textProps} x="375" y="76">pub / sub</text>
        <rect x="480" y="20" width="100" height="28" {...boxProps} />
        <text {...textProps} x="530" y="38">ws client</text>
        <rect x="480" y="60" width="100" height="28" {...boxProps} />
        <text {...textProps} x="530" y="78">sse client</text>
        <rect x="480" y="100" width="100" height="28" {...boxProps} />
        <text {...textProps} x="530" y="118">ws client</text>
        <line x1="110" y1="72" x2="170" y2="72" {...edgeDash} markerEnd={`url(#mini-arrow-${kind})`} />
        <line x1="270" y1="72" x2="330" y2="72" {...edgeDash} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 420 72 L 450 72 L 450 34 L 480 34" {...edgeDash} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 420 72 L 480 72" {...edgeDash} markerEnd={`url(#mini-arrow-${kind})`} />
        <path d="M 420 72 L 450 72 L 450 114 L 480 114" {...edgeDash} markerEnd={`url(#mini-arrow-${kind})`} />
      </svg>
    );
  }

  if (kind === 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, marginTop: 10 }}>
        {common}
        <rect x="20" y="20" width="140" height="100" {...boxProps} strokeDasharray="2 3" />
        <text {...textProps} x="90" y="40">postgres cluster</text>
        <rect x="32" y="55" width="40" height="24" {...boxProps} />
        <text {...textProps} x="52" y="71" style={{ fontSize: 9 }}>ten_a</text>
        <rect x="80" y="55" width="40" height="24" {...boxProps} />
        <text {...textProps} x="100" y="71" style={{ fontSize: 9 }}>ten_b</text>
        <rect x="32" y="85" width="40" height="24" {...boxProps} />
        <text {...textProps} x="52" y="101" style={{ fontSize: 9 }}>ten_c</text>
        <rect x="80" y="85" width="40" height="24" {...boxProps} />
        <text {...textProps} x="100" y="101" style={{ fontSize: 9 }}>ten_d</text>

        <rect x="250" y="55" width="110" height="34" {...boxProps} />
        <text {...textProps} x="305" y="76">provisioner</text>
        <rect x="430" y="55" width="130" height="34" {...boxProps} />
        <text {...textProps} x="495" y="72">flyway · per schema</text>
        <text {...textProps} x="495" y="85" style={{ fontSize: 9, fill: 'var(--graphite)' }}>idempotent</text>

        <line x1="160" y1="72" x2="250" y2="72" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
        <line x1="360" y1="72" x2="430" y2="72" {...edgeProps} markerEnd={`url(#mini-arrow-${kind})`} />
      </svg>
    );
  }

  // kind === 3 — hot-path tuning (before/after)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, marginTop: 10 }}>
      {common}
      <text {...textProps} x="80" y="24" style={{ fontSize: 10, fill: 'var(--graphite)', letterSpacing: '0.1em' }}>BEFORE</text>
      <rect x="20" y="34" width="520" height="22" {...boxProps} />
      <text {...textProps} x="280" y="49" style={{ fontSize: 10 }}>agg · $lookup · $match · $sort · $project — 2100 ms</text>

      <text {...textProps} x="80" y="82" style={{ fontSize: 10, fill: 'var(--graphite)', letterSpacing: '0.1em' }}>AFTER</text>
      <rect x="20" y="92" width="160" height="22" {...boxProps} fill="var(--ink)" stroke="var(--ink)" />
      <text x="100" y="107" textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 10, fill: 'var(--paper)' }}>$match (indexed)</text>
      <rect x="182" y="92" width="100" height="22" {...boxProps} />
      <text {...textProps} x="232" y="107" style={{ fontSize: 10 }}>$sort (idx)</text>
      <rect x="284" y="92" width="90" height="22" {...boxProps} />
      <text {...textProps} x="329" y="107" style={{ fontSize: 10 }}>$project</text>
      <text x="540" y="107" textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: 10, fill: 'var(--ink)', fontWeight: 600 }}>480 ms</text>
    </svg>
  );
}

function WritingPanel({ data }) {
  return (
    <div>
      {data.posts.map((p, i) => (
        <a key={i} href={p.url} target="_blank" rel="noopener"
           style={{
             display: 'block', textDecoration: 'none', color: 'inherit',
             borderTop: '1px solid var(--rule)', padding: '14px 0',
             transition: 'background 140ms',
           }}
           onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in oklab, var(--ink) 3%, transparent)'}
           onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500 }}>{p.title}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', whiteSpace: 'nowrap' }}>{p.date}</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', marginBottom: 6, letterSpacing: '0.04em' }}>{p.meta}</div>
          <p style={{ color: 'var(--ink-2)', margin: 0 }}>{p.excerpt}</p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--graphite)', marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            read on linkedin ↗
          </div>
        </a>
      ))}
    </div>
  );
}

function SimpleProsePanel({ data }) {
  return (
    <div>
      <p>{data.prose}</p>
      {data.action && (
        <div style={{ marginTop: 16 }}>
          <a href={data.action.href}
             download={data.action.download || undefined}
             {...(!data.action.download && { target: '_blank', rel: 'noopener' })}
             style={{
               display: 'inline-block', padding: '8px 14px',
               border: '1px solid var(--ink)', textDecoration: 'none',
               fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.04em'
             }}>
            {data.action.label} {data.action.download ? '↓' : '↗'}
          </a>
        </div>
      )}
    </div>
  );
}

// Contact / endpoints panel — the real public surface.
function ContactPanel() {
  const p = window.PROFILE;
  const [copied, setCopied] = React.useState(null);
  const copy = (val, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    }
  };
  const rows = [
    { k: 'email',    v: p.email,       href: `mailto:${p.email}`, copy: p.email },
    { k: 'phone',    v: p.phone,       href: `tel:${p.phone.replace(/\s/g,'')}`, copy: p.phone },
    { k: 'github',   v: p.github,      href: p.githubUrl },
    { k: 'linkedin', v: p.linkedin,    href: p.linkedinUrl },
    { k: 'site',     v: p.site,        href: p.siteUrl },
    { k: 'location', v: p.location,    href: null },
  ];
  return (
    <div>
      <p style={{ marginBottom: 18 }}>The public surface — every endpoint that actually resolves. Click to open; copy icon to grab the raw value.</p>
      <div style={{ border: '1px solid var(--rule)' }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr auto',
            alignItems: 'center', gap: 14, padding: '12px 14px',
            borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
            fontFamily: 'var(--mono)', fontSize: 12.5,
          }}>
            <div style={{ color: 'var(--graphite)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 10.5 }}>{r.k}</div>
            <div style={{ color: 'var(--ink)', wordBreak: 'break-all' }}>
              {r.href ? <a href={r.href} target="_blank" rel="noopener">{r.v}</a> : r.v}
            </div>
            <button onClick={() => copy(r.copy || r.v, r.k)}
                    style={{
                      fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.04em',
                      border: '1px solid var(--rule)', background: 'var(--paper)',
                      color: 'var(--ink)', padding: '3px 9px', cursor: 'pointer',
                      minWidth: 64,
                    }}>
              {copied === r.k ? 'copied' : 'copy'}
            </button>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', marginTop: 14 }}>
        fastest path is email. I answer most threads within a working day.
      </p>
    </div>
  );
}

function Panel({ panelKey, onClose, onOpenOther }) {
  if (!panelKey) return null;
  const data = window.PANELS[panelKey];
  if (!data) return null;

  let body = null;
  if (panelKey === "about")       body = <ProsePanel data={data} />;
  else if (panelKey === "experience") body = <ExperiencePanel data={data} openFlame={() => onOpenOther && onOpenOther("trace")} />;
  else if (panelKey === "projects")   body = <ProjectsPanel data={data} />;
  else if (panelKey === "systems")    body = <SystemsPanel data={data} />;
  else if (panelKey === "writing")    body = <WritingPanel data={data} />;
  else if (panelKey === "terminal")   body = <TerminalWidget />;
  else if (panelKey === "trace")      body = <window.Flamegraph />;
  else if (panelKey === "contact")    body = <ContactPanel />;
  else if (panelKey === "altrium" || panelKey === "zeroday" || panelKey === "ceyentra") {
    const role = window.PANELS.experience.roles[data.roleIndex];
    body = (
      <div>
        <div className="role" style={{ paddingTop: 4, borderTop: 'none' }}>
          <div className="role-head">
            <div>
              <div className="company">{role.company}</div>
              <div className="title">{role.title}</div>
            </div>
            <div className="dates">{role.dates}</div>
          </div>
          <div className="context">{role.context}</div>
          <ul>
            {role.bullets.map((b, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: b }} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
  else                                body = <SimpleProsePanel data={data} />;

  return (
    <>
      <div className={`drawer-scrim open`} onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-label={data.title}>
        <header className="drawer-head">
          <div>
            <div className="kicker">{data.kicker}</div>
            <h2>{data.title}</h2>
            {data.hint && <div className="hint" style={{ marginTop: 4 }}>{data.hint}</div>}
          </div>
          <button className="drawer-close" onClick={onClose}>CLOSE · esc</button>
        </header>
        <div className="drawer-body">
          {body}
        </div>
      </aside>
    </>
  );
}

window.Panel = Panel;
