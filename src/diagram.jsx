// Architecture canvas — the navigation surface.
// Renders nodes + ortho-routed edges + hover-driven traffic particles.

const VB_W = 1320;
const VB_H = 900;

function nodeById(id) { return window.NODES.find(n => n.id === id); }

// Given source+target node, return an ortho path that leaves the right side
// of the source and enters the left side of the target, with a mid-bend.
function orthoPath(a, b) {
  const ax = a.x + a.w, ay = a.y + a.h / 2;
  const bx = b.x,       by = b.y + b.h / 2;
  const midX = ax + (bx - ax) / 2;
  return `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`;
}

// Render a db "cylinder" shape.
function Cylinder({ x, y, w, h }) {
  const rx = w / 2, ry = 8;
  return (
    <g>
      <path d={`M ${x} ${y + ry} Q ${x} ${y} ${x + rx} ${y} Q ${x + w} ${y} ${x + w} ${y + ry} L ${x + w} ${y + h - ry} Q ${x + w} ${y + h} ${x + rx} ${y + h} Q ${x} ${y + h} ${x} ${y + h - ry} Z`} className="cyl-body" />
      <path d={`M ${x} ${y + ry} Q ${x} ${y + 2*ry} ${x + rx} ${y + 2*ry} Q ${x + w} ${y + 2*ry} ${x + w} ${y + ry}`} className="cyl-top" />
    </g>
  );
}

// Render a queue shape (rectangle with vertical ticks).
function QueueShape({ x, y, w, h }) {
  const ticks = [];
  const tickCount = 4;
  const innerPad = 14;
  const innerW = w - innerPad * 2;
  const step = innerW / tickCount;
  for (let i = 1; i < tickCount; i++) {
    const tx = x + innerPad + i * step;
    ticks.push(<line key={i} x1={tx} y1={y + 8} x2={tx} y2={y + h - 8} className="queue-tick" />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} />
      {ticks}
    </g>
  );
}

function Node({ node, hovered, active, onHover, onClick }) {
  const isHover = hovered === node.id;
  const isActive = active === node.id;
  const cls = `node ${isHover ? 'hover' : ''} ${isActive ? 'active' : ''} node-${node.kind}`;

  const labelX = node.x + node.w / 2;
  const labelY = node.y + node.h / 2 + 2;
  const subY   = node.y + node.h + 14;

  return (
    <g className={cls}
       onMouseEnter={() => onHover(node.id)}
       onMouseLeave={() => onHover(null)}
       onClick={() => onClick(node)}>
      {node.kind === "db" && <Cylinder x={node.x} y={node.y} w={node.w} h={node.h} />}
      {node.kind === "queue" && <QueueShape x={node.x} y={node.y} w={node.w} h={node.h} />}
      {(node.kind === "service" || node.kind === "client" || node.kind === "instance") && (
        <rect x={node.x} y={node.y} width={node.w} height={node.h} />
      )}
      {/* Small service-marker "port" dots on left/right */}
      {(node.kind === "service" || node.kind === "instance") && (
        <>
          <circle cx={node.x} cy={node.y + node.h / 2} r="2.5" className="port" />
          <circle cx={node.x + node.w} cy={node.y + node.h / 2} r="2.5" className="port" />
        </>
      )}
      {node.kind === "instance" && node.uptime && (
        <InstanceMeta node={node} />
      )}
      <text className={`label ${node.kind === 'instance' ? 'label-sm' : ''}`} x={labelX} y={node.kind === 'instance' ? node.y + 26 : labelY} textAnchor="middle" dominantBaseline="middle">{node.label}</text>
      <text className="sub" x={labelX} y={node.kind === 'instance' ? node.y + 42 : subY} textAnchor="middle">{node.sub}</text>
    </g>
  );
}

// Uptime bar for instance nodes — shows tenure on a shared career timeline.
const CAREER_START = 2020.5;
const CAREER_END = 2026.0;
function InstanceMeta({ node }) {
  const { x, y, w, h, uptime } = node;
  const pad = 14;
  const barX = x + pad;
  const barW = w - pad * 2;
  const barY = y + h - 22;
  const span = CAREER_END - CAREER_START;
  const sx = barX + ((uptime.start - CAREER_START) / span) * barW;
  const ex = barX + ((uptime.end   - CAREER_START) / span) * barW;
  return (
    <g className="instance-meta">
      {/* baseline */}
      <line x1={barX} y1={barY} x2={barX + barW} y2={barY} className="uptime-base" />
      {/* active tenure */}
      <line x1={sx} y1={barY} x2={ex} y2={barY} className="uptime-bar" />
      <text x={barX} y={barY + 12} className="uptime-label" textAnchor="start">{uptime.label}</text>
    </g>
  );
}

// Traffic particles along a single path — rendered as tiny rects that animate
// along the path using SVG <animateMotion>. Two staggered particles per edge.
function EdgeParticles({ pathId, duration, active }) {
  if (!active) return null;
  return (
    <>
      <rect className="particle" width="5" height="5" x="-3" y="-3" rx="0.5">
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </rect>
      <rect className="particle" width="5" height="5" x="-3" y="-3" rx="0.5">
        <animateMotion dur={`${duration}s`} begin={`${duration / 2}s`} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </rect>
    </>
  );
}

function Edge({ edge, index, hoveredEdge, hoveredNode, onHoverEdge, motion }) {
  const a = nodeById(edge.from);
  const b = nodeById(edge.to);
  if (!a || !b) return null;
  const d = orthoPath(a, b);
  const pathId = `edge-path-${index}`;
  const isHover = hoveredEdge === index || hoveredNode === edge.from || hoveredNode === edge.to;

  // Label position near the vertical mid-bend.
  const ax = a.x + a.w, bx = b.x;
  const midX = ax + (bx - ax) / 2;
  const labelY = Math.min(a.y + a.h/2, b.y + b.h/2) - 6;

  const duration = motion === "lively" ? 2.2 : motion === "off" ? 0 : 4.2;

  return (
    <g className={`edge-group ${isHover ? 'active' : ''}`}>
      <path id={pathId} className={`edge ${edge.kind === 'async' ? 'async' : ''}`} d={d} />
      {/* fat invisible hit region so edges are easy to hover */}
      <path className="edge-hit" d={d}
            onMouseEnter={() => onHoverEdge(index)}
            onMouseLeave={() => onHoverEdge(null)} />
      {isHover && (
        <text className="edge-label" x={midX} y={labelY} textAnchor="middle">
          {edge.label}
        </text>
      )}
      {motion !== "off" && <EdgeParticles pathId={pathId} duration={duration} active={isHover} />}
    </g>
  );
}

// Boundary rectangles with labels
function Regions() {
  return (
    <g className="regions">
      {/* Navigation region */}
      <rect className="region" x={340} y={140} width={220} height={580} />
      <text className="region-label" x={340} y={130}>NAVIGATION</text>

      {/* Interactive region */}
      <rect className="region" x={700} y={140} width={240} height={580} />
      <text className="region-label" x={700} y={130}>INTERACTIVE SURFACES</text>

      {/* Work-log region */}
      <rect className="region" x={1040} y={140} width={240} height={620} />
      <text className="region-label" x={1040} y={130}>WORK LOG · career timeline</text>
      {/* shared timeline axis under the three instance nodes */}
      <g className="timeline-axis">
        <text className="region-label" x={1040} y={788} style={{ fontSize: 9 }}>2020</text>
        <text className="region-label" x={1158} y={788} style={{ fontSize: 9, textAnchor: 'middle' }} textAnchor="middle">now</text>
        <text className="region-label" x={1280} y={788} style={{ fontSize: 9, textAnchor: 'end' }} textAnchor="end">2026</text>
      </g>
    </g>
  );
}

// Compass + title overlays — hand-annotated blueprint feel
function CanvasAnnotations() {
  return (
    <g className="annotations">
      <text className="region-label" x={40} y={80} style={{ fontSize: 11, letterSpacing: '0.22em' }}>
        PAVITHRA.SYSTEM · v5
      </text>
      <text className="region-label" x={40} y={100} style={{ fontSize: 9.5, letterSpacing: '0.14em' }}>
        fig. 01 — portfolio topology
      </text>
      <text className="region-label" x={40} y={820} style={{ fontSize: 9.5, letterSpacing: '0.14em' }}>
        scale · 1 : arbitrary
      </text>
      <text className="region-label" x={40} y={840} style={{ fontSize: 9.5, letterSpacing: '0.14em' }}>
        drawn · 2026·04
      </text>
    </g>
  );
}

function ArchitectureDiagram({ onOpenPanel, motion }) {
  const [hoverNode, setHoverNode] = React.useState(null);
  const [hoverEdge, setHoverEdge] = React.useState(null);
  const [active, setActive] = React.useState(null);

  const handleOpen = (node) => {
    if (!node.panel) return;
    setActive(node.id);
    onOpenPanel(node.panel, () => setActive(null));
  };

  return (
    <svg className="diagram" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto-start-reverse">
          <path d="M 0 0 L 6 4 L 0 8 z" fill="var(--graphite)" />
        </marker>
      </defs>

      <CanvasAnnotations />
      <Regions />

      {window.EDGES.map((e, i) => (
        <Edge key={i} edge={e} index={i}
              hoveredEdge={hoverEdge} hoveredNode={hoverNode}
              onHoverEdge={setHoverEdge}
              motion={motion} />
      ))}

      {window.NODES.map(n => (
        <Node key={n.id} node={n} hovered={hoverNode} active={active}
              onHover={setHoverNode} onClick={handleOpen} />
      ))}
    </svg>
  );
}

window.ArchitectureDiagram = ArchitectureDiagram;
