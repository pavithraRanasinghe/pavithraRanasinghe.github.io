// Tweaks panel — floating, toggled by host toolbar.

function Tweaks({ tweaks, setTweak, visible, onClose }) {
  if (!visible) return null;
  const opts = {
    theme: [
      { v: "paper", label: "paper" },
      { v: "slate", label: "slate" },
      { v: "blueprint", label: "blueprint" },
    ],
    typography: [
      { v: "mixed", label: "mixed" },
      { v: "mono", label: "mono only" },
      { v: "serif", label: "serif body" },
    ],
    signature: [
      { v: "traffic", label: "traffic" },
      { v: "terminal", label: "terminal" },
      { v: "trace", label: "trace" },
    ],
    motion: [
      { v: "calm", label: "calm" },
      { v: "lively", label: "lively" },
      { v: "off", label: "off" },
    ],
  };
  return (
    <div className="tweaks">
      <h4>
        <span>TWEAKS</span>
        <span style={{ fontSize: 10, color: 'var(--graphite)' }}>v1</span>
      </h4>
      <div className="tweaks-body">
        {Object.entries(opts).map(([key, list]) => (
          <div key={key} className="tweak-group">
            <label>{key}</label>
            <div className="tweak-opts">
              {list.map(o => (
                <button key={o.v}
                        className={`tweak-opt ${tweaks[key] === o.v ? 'active' : ''}`}
                        onClick={() => setTweak(key, o.v)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: 'var(--graphite)', marginTop: 8, letterSpacing: '0.04em' }}>
          changes apply instantly · session only
        </div>
      </div>
    </div>
  );
}

window.Tweaks = Tweaks;
