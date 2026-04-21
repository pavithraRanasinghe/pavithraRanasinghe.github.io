// Top-level app — masthead, canvas, drawer, tweaks wiring, edit-mode protocol.

function Masthead({ signature }) {
  const sigLabel = {
    traffic: "traffic · hover any edge",
    terminal: "terminal · click node to run",
    trace: "trace · flamegraph on experience",
  }[signature] || "traffic";

  return (
    <header className="masthead">
      <div className="lockup">
        <h1>Pavithra Ranasinghe</h1>
        <div className="subtitle">Senior Software Engineer · backend, distributed systems</div>
      </div>
      <div className="meta">
        <div className="live">system · nominal</div>
        <div>mode · {sigLabel}</div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="legend">
        <span className="swatch"><span className="line-solid"></span> sync</span>
        <span className="swatch"><span className="line-dash"></span> async</span>
        <span className="swatch"><span className="dot"></span> traffic on hover</span>
      </div>
      <div>click a service to drill in · esc to close</div>
    </footer>
  );
}

function App() {
  const [tweaks, setTweaks] = React.useState(window.__TWEAKS__ || { theme: "paper", typography: "mixed", signature: "traffic", motion: "calm" });
  const [panel, setPanel] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // Apply theme + typography to <html> for CSS variables.
  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.dataset.typography = tweaks.typography;
    document.documentElement.dataset.motion = tweaks.motion;
  }, [tweaks]);

  // Edit mode protocol — listener first, then announce.
  React.useEffect(() => {
    const handler = (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode') setEditMode(true);
      if (d.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent && window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Esc closes drawer
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent && window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  const closePanelCallback = React.useRef(null);
  const openPanel = (key, onCloseCallback) => {
    setPanel(key);
    closePanelCallback.current = onCloseCallback || null;
  };
  const closePanel = React.useCallback(() => {
    setPanel(null);
    if (closePanelCallback.current) {
      closePanelCallback.current();
      closePanelCallback.current = null;
    }
  }, []);

  // If signature tweak is set, auto-open the corresponding panel when user
  // clicks the masthead pill. Kept simple: clicking the meta opens that panel.
  const openSignature = () => {
    if (tweaks.signature === "terminal") openPanel("terminal");
    else if (tweaks.signature === "trace") openPanel("trace");
    else closePanel();
  };

  return (
    <>
      <div className="paper" />
      <div onClick={openSignature} style={{ cursor: 'pointer' }}>
        <Masthead signature={tweaks.signature} />
      </div>
      <div className="canvas-wrap">
        <window.ArchitectureDiagram onOpenPanel={openPanel} motion={tweaks.motion} />
      </div>
      <Footer />
      <window.Panel panelKey={panel} onClose={closePanel} onOpenOther={openPanel} />
      <button
        className="tweaks-toggle"
        onClick={() => setTweaksOpen(o => !o)}
        title="Customise appearance"
      >
        {tweaksOpen ? '✕ close' : '⊞ tweaks'}
      </button>
      <window.Tweaks tweaks={tweaks} setTweak={setTweak} visible={editMode || tweaksOpen} onClose={() => { setEditMode(false); setTweaksOpen(false); }} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
