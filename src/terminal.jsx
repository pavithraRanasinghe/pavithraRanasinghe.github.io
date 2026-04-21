// Typeable terminal widget. Supports a small fixed vocabulary of commands
// that read from window.PROFILE / window.PANELS.

let _k = 0;
const nextKey = () => ++_k;

const COMMANDS = {
  help: "list commands",
  ls:   "list sections",
  whoami: "profile summary",
  "cat about": "read about",
  "cat experience": "latest role summary",
  "cat projects": "selected projects",
  stack: "technical stack",
  uptime: "years shipping code",
  contact: "how to reach me",
  clear: "clear screen",
};

function prompt() {
  return <span className="prompt">pavithra@portfolio</span>;
}

function Line({ children, className }) {
  return <div className={`line ${className || ''}`}>{children}</div>;
}

function renderCommand(cmd, setLines) {
  const add = (nodes) => setLines(prev => [...prev, ...nodes]);
  const out = [];

  const c = cmd.trim();
  if (!c) return;

  if (c === "help") {
    out.push(<Line key={nextKey()}><span className="dim">available commands:</span></Line>);
    Object.entries(COMMANDS).forEach(([k, v]) => {
      out.push(
        <Line key={nextKey()}>
          <span className="accent">{k.padEnd(18)}</span><span className="dim">{v}</span>
        </Line>
      );
    });
  } else if (c === "ls") {
    out.push(<Line key={nextKey()}><span className="dim">sections:</span></Line>);
    out.push(<Line key={nextKey()}>about  experience  projects  systems  writing  resume</Line>);
  } else if (c === "whoami") {
    const p = window.PROFILE;
    out.push(<Line key={nextKey()}><b>{p.name}</b> — {p.title}</Line>);
    out.push(<Line key={nextKey()}><span className="dim">{p.blurb}</span></Line>);
    out.push(<Line key={nextKey()}><span className="dim">{p.based}</span></Line>);
  } else if (c === "cat about" || c === "about") {
    const s = window.PANELS.about.sections.filter(x => x.kind === "prose").slice(0, 2);
    s.forEach(p => out.push(<Line key={nextKey()}>{p.body}</Line>));
  } else if (c === "cat experience" || c === "experience") {
    const role = window.PANELS.experience.roles[0];
    out.push(<Line key={nextKey()}><b>{role.company}</b> <span className="dim">· {role.dates}</span></Line>);
    out.push(<Line key={nextKey()}><span className="dim">{role.title} — {role.context}</span></Line>);
    role.bullets.slice(0, 3).forEach(b => {
      out.push(<Line key={nextKey()}>• <span dangerouslySetInnerHTML={{ __html: b }} /></Line>);
    });
  } else if (c === "cat projects" || c === "projects") {
    window.PANELS.projects.items.forEach(p => {
      out.push(<Line key={nextKey()}><span className="accent">▸ {p.name}</span></Line>);
      out.push(<Line key={nextKey()}><span className="dim">  {p.meta}</span></Line>);
    });
  } else if (c === "stack") {
    const entries = window.PANELS.about.sections.find(s => s.kind === "stack").entries;
    entries.forEach(([k, v]) => {
      out.push(<Line key={nextKey()}><span className="accent">{k.padEnd(16)}</span>{v}</Line>);
    });
  } else if (c === "uptime") {
    out.push(<Line key={nextKey()}><b>5 yrs 3 mo</b> <span className="dim">· shipping to production</span></Line>);
    out.push(<Line key={nextKey()}><span className="dim">2 companies · 3 countries' users · still on-call-calm</span></Line>);
  } else if (c === "contact") {
    out.push(<Line key={nextKey()}>email: <span className="accent">{window.PROFILE.email}</span></Line>);
    out.push(<Line key={nextKey()}><span className="dim">always the fastest way to reach me.</span></Line>);
  } else if (c === "clear") {
    setLines([]);
    return;
  } else {
    out.push(<Line key={nextKey()}><span className="dim">command not found:</span> {c}. <span className="dim">try</span> <span className="accent">help</span></Line>);
  }

  add([
    <Line key={nextKey()}>
      {prompt()} <span className="dim">~ $</span> {c}
    </Line>,
    ...out,
    <Line key={nextKey()}>&nbsp;</Line>,
  ]);
}

function TerminalWidget() {
  const [lines, setLines] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [history, setHistory] = React.useState([]);
  const [hIdx, setHIdx] = React.useState(-1);
  const inputRef = React.useRef(null);
  const boxRef = React.useRef(null);

  // Intro content on mount
  React.useEffect(() => {
    const intro = [
      <Line key="i1"><span className="dim">pavithra.engineer terminal · v1.0 · 2026</span></Line>,
      <Line key="i2"><span className="dim">type</span> <span className="accent">help</span> <span className="dim">to see commands, or click a chip.</span></Line>,
      <Line key="i3">&nbsp;</Line>,
    ];
    setLines(intro);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, []);

  React.useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines]);

  const submit = (cmd) => {
    const c = (cmd ?? value).trim();
    renderCommand(c, setLines);
    if (c) setHistory(prev => [...prev, c]);
    setValue("");
    setHIdx(-1);
  };

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next); setValue(history[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx < 0) return;
      const next = hIdx + 1;
      if (next >= history.length) { setHIdx(-1); setValue(""); }
      else { setHIdx(next); setValue(history[next] || ""); }
    }
  };

  const chips = ["help", "whoami", "cat about", "cat projects", "stack", "contact"];

  return (
    <div>
      <div className="term" ref={boxRef} onClick={() => inputRef.current && inputRef.current.focus()}>
        {lines}
        <div className="line">
          {prompt()} <span className="dim">~ $</span>{" "}
          <input ref={inputRef} value={value}
                 onChange={e => setValue(e.target.value)}
                 onKeyDown={onKey}
                 spellCheck={false} autoComplete="off" />
        </div>
      </div>
      <div className="term-chip-row">
        {chips.map(c => (
          <button key={c} className="term-chip" onClick={() => submit(c)}>{c}</button>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--graphite)', marginTop: 12 }}>
        arrow-up for history · enter to run · this isn't a shell, just a curated playground.
      </p>
    </div>
  );
}

window.TerminalWidget = TerminalWidget;
