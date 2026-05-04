// app.jsx — mrkbr.com personal site
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "acid",
  "headingFont": "VT323",
  "scanlines": true,
  "cursorBlink": true,
  "showAvatar": true,
  "avatarStyle": "photo",
  "density": "regular",
  "showStatus": true,
  "showFooter": true
}/*EDITMODE-END*/;

const THEMES = {
  acid:    { bg: "#0d0d0d", fg: "#e8e8e6", dim: "#6b6b66", accent: "#e0ff4a", line: "#1f1f1d", chip: "#15150f" },
  amber:   { bg: "#0a0805", fg: "#f4d6a8", dim: "#7a6446", accent: "#ffb000", line: "#1c1610", chip: "#1a140a" },
  green:   { bg: "#050a05", fg: "#c8f0c8", dim: "#5a7a5a", accent: "#33ff66", line: "#0f1a0f", chip: "#0a1a0a" },
  cyan:    { bg: "#0a1018", fg: "#dbe9f4", dim: "#5e7a92", accent: "#7dd3fc", line: "#142030", chip: "#0d1828" },
  paper:   { bg: "#f5f4ee", fg: "#1a1a18", dim: "#8a8a82", accent: "#ff4500", line: "#dedcd2", chip: "#ebe9df" }
};

const HEADING_FONTS = {
  "VT323": "'VT323', monospace",
  "Press Start 2P": "'Press Start 2P', monospace",
  "Silkscreen": "'Silkscreen', monospace",
  "Pixelify Sans": "'Pixelify Sans', monospace",
  "DotGothic16": "'DotGothic16', monospace"
};

const ASCII_AVATAR = [
  "  ░░▒▒▒▒▒▒▒▒░░  ",
  " ░▒▒▓▓▓▓▓▓▓▓▒▒░ ",
  "░▒▓▓▓▓▓▓▓▓▓▓▓▓▒░",
  "▒▓▓▓██▓▓▓▓██▓▓▓▒",
  "▒▓▓▓██▓▓▓▓██▓▓▓▒",
  "▒▓▓▓▓▓▓██▓▓▓▓▓▓▒",
  "▒▓▓▓██▓▓▓▓██▓▓▓▒",
  "░▒▓▓▓████████▓▓▒░",
  " ░▒▒▓▓▓▓▓▓▓▓▒▒░ ",
  "  ░░▒▒▒▒▒▒▒▒░░  "
];

const PIXEL_AVATAR_GRID = [
  "..XXXXXXXX..",
  ".X........X.",
  "X..XX..XX..X",
  "X..XX..XX..X",
  "X..........X",
  "X..X....X..X",
  "X...XXXX...X",
  "X..........X",
  ".X........X.",
  "..XXXXXXXX..",
];

// ─── HERO ──────────────────────────────────────────────────────────────────

// Drop a real photo at ./profile.jpg (or .png) — the frame falls back to a
// placeholder if the file isn't present. Keep it square; everything is 1:1.
const PROFILE_SRC = "profile.jpg";

function PixelAvatar({ theme, style }) {
  const SIZE = 200;

  if (style === "photo") {
    const [errored, setErrored] = useState(false);
    return (
      <div style={{
        width: SIZE, height: SIZE, position: "relative",
        border: `1px solid ${theme.line}`,
        background: theme.chip,
        boxShadow: `4px 4px 0 ${theme.accent}`,
        overflow: "hidden"
      }}>
        {!errored ? (
          <img src={PROFILE_SRC} alt="profile" onError={() => setErrored(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: "contrast(1.02) saturate(0.95)"
            }} />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            backgroundImage:
              `repeating-linear-gradient(45deg, ${theme.line} 0 1px, transparent 1px 10px)`
          }}>
            <div style={{
              width: 56, height: 56, border: `2px solid ${theme.accent}`,
              display: "grid", placeItems: "center",
              fontFamily: "'VT323', monospace", fontSize: 36, color: theme.accent,
              textShadow: `0 0 10px ${theme.accent}88`
            }}>MK</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: theme.dim, letterSpacing: "0.15em", textTransform: "uppercase"
            }}>profile.jpg</div>
          </div>
        )}
        {/* corner brackets */}
        {[
          { top: -1, left: -1, borderTop: `2px solid ${theme.accent}`, borderLeft: `2px solid ${theme.accent}` },
          { top: -1, right: -1, borderTop: `2px solid ${theme.accent}`, borderRight: `2px solid ${theme.accent}` },
          { bottom: -1, left: -1, borderBottom: `2px solid ${theme.accent}`, borderLeft: `2px solid ${theme.accent}` },
          { bottom: -1, right: -1, borderBottom: `2px solid ${theme.accent}`, borderRight: `2px solid ${theme.accent}` }
        ].map((s, i) => (
          <div key={i} aria-hidden style={{ position: "absolute", width: 12, height: 12, ...s }} />
        ))}
      </div>
    );
  }

  if (style === "ascii") {
    return (
      <div style={{
        width: SIZE, height: SIZE,
        border: `1px solid ${theme.line}`, background: theme.chip,
        display: "grid", placeItems: "center",
        boxShadow: `4px 4px 0 ${theme.accent}`
      }}>
        <pre style={{
          margin: 0, color: theme.accent, fontFamily: "'VT323', monospace",
          fontSize: 18, lineHeight: 1, letterSpacing: 0,
          textShadow: `0 0 8px ${theme.accent}55`
        }}>{ASCII_AVATAR.join("\n")}</pre>
      </div>
    );
  }
  if (style === "grid") {
    const cell = Math.floor(SIZE / 14);
    return (
      <div style={{
        width: SIZE, height: SIZE,
        border: `1px solid ${theme.line}`, background: theme.chip,
        display: "grid", placeItems: "center",
        boxShadow: `4px 4px 0 ${theme.accent}`
      }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(12, ${cell}px)`, gap: 1 }}>
          {PIXEL_AVATAR_GRID.flatMap((row, y) =>
            row.split("").map((c, x) => (
              <div key={`${x}-${y}`} style={{
                width: cell, height: cell,
                background: c === "X" ? theme.accent : "transparent",
                boxShadow: c === "X" ? `0 0 4px ${theme.accent}66` : "none"
              }} />
            ))
          )}
        </div>
      </div>
    );
  }
  // monogram
  return (
    <div style={{
      width: SIZE, height: SIZE, display: "grid", placeItems: "center",
      border: `2px solid ${theme.accent}`,
      fontFamily: "'VT323', monospace", fontSize: 110, color: theme.accent,
      textShadow: `0 0 16px ${theme.accent}88`,
      background: theme.chip,
      boxShadow: `4px 4px 0 ${theme.accent}`
    }}>MK</div>
  );
}

function Cursor({ blink, color }) {
  return (
    <span style={{
      display: "inline-block", width: "0.55em", height: "1em",
      background: color, marginLeft: 4, verticalAlign: "-0.15em",
      animation: blink ? "blink 1.05s steps(2) infinite" : "none"
    }} />
  );
}

function ScrambleLink({ children, href, theme, dim }) {
  const [text, setText] = useState(children);
  const intervalRef = useRef(null);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const scramble = () => {
    const target = children;
    let frame = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const out = target.split("").map((c, i) => {
        if (i < frame * 0.6) return c;
        if (c === " ") return " ";
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      setText(out);
      frame++;
      if (frame > target.length / 0.6 + 2) {
        clearInterval(intervalRef.current);
        setText(target);
      }
    }, 30);
  };

  const stop = () => { clearInterval(intervalRef.current); setText(children); };

  return (
    <a href={href} target="_blank" rel="noreferrer"
       onMouseEnter={scramble} onMouseLeave={stop}
       style={{
         color: dim ? theme.dim : theme.fg, textDecoration: "none",
         borderBottom: `1px dashed ${theme.dim}`,
         paddingBottom: 1, transition: "color .15s, border-color .15s"
       }}
       onFocus={scramble} onBlur={stop}
    >{text}</a>
  );
}

function Hero({ theme, t }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const bio = "Building and shipping AI products for 13+ years, my expertise spans the full development lifecycle, from traditional machine learning pipelines and orchestration to training, inference, and MLOps. Currently focused on agentic software development and the engineering required to scale complex infrastructure into functional, production-ready systems. A builder at heart with a track record of turning AI concepts into real-world products.";

  return (
    <section style={{ paddingTop: 64, paddingBottom: 80, borderBottom: `1px solid ${theme.line}` }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 12, color: theme.dim, marginBottom: 48,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        <span>~/mrkbr.com</span>
        <span>{time.toISOString().replace("T", " ").slice(0, 19)} UTC</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 40, flexWrap: "wrap" }}>
        {t.showAvatar && (
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            <PixelAvatar theme={theme} style={t.avatarStyle} />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: theme.accent, marginBottom: 14, letterSpacing: "0.15em"
          }}>
            ▸ hello_world.sh
          </div>

          <h1 style={{
            fontFamily: HEADING_FONTS[t.headingFont],
            fontSize: t.headingFont === "Press Start 2P" ? 36 : (t.headingFont === "Silkscreen" ? 48 : 88),
            lineHeight: t.headingFont === "Press Start 2P" ? 1.2 : 0.95,
            margin: "0 0 6px 0", color: theme.fg, letterSpacing: "-0.01em",
            textShadow: `0 0 24px ${theme.accent}22`
          }}>
            mrkbr<span style={{ color: theme.accent }}>.com</span>
            {t.cursorBlink && <Cursor blink={true} color={theme.accent} />}
          </h1>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            color: theme.dim, marginBottom: 32
          }}>
            // ai engineer · builder · 13y shipping
          </div>

          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15, lineHeight: 1.7, color: theme.fg,
            maxWidth: 640, margin: 0, textWrap: "pretty"
          }}>
            {bio}
          </p>

          {t.showStatus && (
            <div style={{
              marginTop: 32, padding: "12px 14px",
              border: `1px solid ${theme.line}`,
              background: theme.chip,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, color: theme.dim,
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"
            }}>
              <span style={{
                width: 8, height: 8, background: theme.accent, borderRadius: "50%",
                boxShadow: `0 0 8px ${theme.accent}`,
                animation: "pulse 2s ease-in-out infinite"
              }} />
              <span style={{ color: theme.fg }}>STATUS:</span>
              <span>building agents · scaling infra · shipping</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIALS ───────────────────────────────────────────────────────────────

const SOCIALS = [
  { key: "linkedin", label: "linkedin",  handle: "/in/marekbruchaty", url: "https://www.linkedin.com/in/marekbruchaty/",
    art: ["█       █", "█       █", "█       █", "█  ███  █", "█  █ █  █", "█  ███  █"] },
  { key: "twitter",  label: "twitter / x", handle: "@mrkcrts",         url: "https://x.com/mrkcrts",
    art: ["█  █  █  █", "█  █  █  █", "█   ██   █", "█   ██   █", "█  █  █  █", "█  █  █  █"] },
  { key: "medium",   label: "medium",     handle: "@marekbruchaty",    url: "https://medium.com/@marekbruchaty",
    art: ["█        █", "█  █  █  █", "█  ██ ██ █", "█  █ █ █ █", "█  █   █ █", "█        █"] },
  { key: "email",    label: "email",      handle: "marekbruchaty@gmail.com", url: "mailto:marekbruchaty@gmail.com",
    art: ["█████████", "██     ██", "█ █   █ █", "█  █ █  █", "█   █   █", "█████████"] }
];

function SocialCard({ item, theme, idx }) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const onClick = (e) => {
    if (item.key === "email") {
      e.preventDefault();
      navigator.clipboard?.writeText(item.handle.replace(/^@/, "")).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <a href={item.url} target="_blank" rel="noreferrer" onClick={onClick}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: "flex", flexDirection: "column", gap: 14,
         padding: "20px 18px",
         border: `1px solid ${hover ? theme.accent : theme.line}`,
         background: hover ? theme.chip : "transparent",
         color: theme.fg, textDecoration: "none",
         transition: "all .12s ease",
         position: "relative", overflow: "hidden",
         transform: hover ? "translate(-2px, -2px)" : "translate(0,0)",
         boxShadow: hover ? `4px 4px 0 ${theme.accent}` : "0 0 0 transparent"
       }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: theme.dim, letterSpacing: "0.15em",
        display: "flex", justifyContent: "space-between"
      }}>
        <span>0{idx + 1}</span>
        <span>{hover ? "↗ open" : "—"}</span>
      </div>

      <div style={{
        fontFamily: "'VT323', monospace", fontSize: 14,
        color: hover ? theme.accent : theme.dim, lineHeight: 1,
        whiteSpace: "pre", height: 84, display: "flex", alignItems: "center"
      }}>
        {item.art.join("\n")}
      </div>

      <div>
        <div style={{
          fontFamily: HEADING_FONTS.VT323, fontSize: 28,
          color: theme.fg, lineHeight: 1, marginBottom: 4
        }}>
          {item.label}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: theme.dim
        }}>
          {copied ? "✓ copied to clipboard" : item.handle}
        </div>
      </div>
    </a>
  );
}

function Socials({ theme, t }) {
  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: `1px solid ${theme.line}` }}>
      <SectionHeading theme={theme} t={t} num="02" label="reach_out" sub="// pick a wire — i'll respond" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14, marginTop: 36
      }}>
        {SOCIALS.map((s, i) => <SocialCard key={s.key} item={s} idx={i} theme={theme} />)}
      </div>
    </section>
  );
}

// ─── ARTICLES ──────────────────────────────────────────────────────────────

const ARTICLES = [
  { title: "The missing link in AI-driven development: why I stopped typing to my agents",
    summary: "Voice beats keyboard for steering coding agents — escaping the context trap and shipping richer instructions in a fraction of the time.",
    date: "2025-11-28", read: "5 min", platform: "medium",
    url: "https://medium.com/@marekbruchaty/the-missing-link-in-ai-driven-development-why-i-stopped-typing-to-my-agents-99c9072a857c",
    tags: ["agents", "voice", "workflow"] }
];

function ArticleRow({ a, theme, idx }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={a.url} target="_blank" rel="noreferrer"
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: "grid",
         gridTemplateColumns: "60px 110px 1fr 90px 60px",
         alignItems: "baseline", gap: 24,
         padding: "22px 4px",
         borderBottom: `1px solid ${theme.line}`,
         color: theme.fg, textDecoration: "none",
         background: hover ? theme.chip : "transparent",
         transition: "background .12s",
         position: "relative"
       }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: theme.dim
      }}>
        {String(idx + 1).padStart(2, "0")}
      </span>

      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: theme.dim
      }}>
        {a.date}
      </span>

      <div>
        <div style={{
          fontFamily: "'VT323', monospace", fontSize: 26,
          color: hover ? theme.accent : theme.fg, lineHeight: 1.2,
          marginBottom: 14, transition: "color .12s"
        }}>
          {a.title}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
          color: theme.dim, lineHeight: 1.55, maxWidth: 620, textWrap: "pretty"
        }}>
          {a.summary}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {a.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: theme.dim, padding: "2px 7px",
              border: `1px solid ${theme.line}`,
              background: theme.chip, letterSpacing: "0.08em"
            }}>#{tag}</span>
          ))}
        </div>
      </div>

      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: theme.dim, textTransform: "uppercase", letterSpacing: "0.12em",
        textAlign: "right"
      }}>
        {a.platform}
      </span>

      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: hover ? theme.accent : theme.dim, textAlign: "right",
        transform: hover ? "translateX(4px)" : "translateX(0)",
        transition: "transform .15s"
      }}>
        {hover ? "→" : a.read}
      </span>
    </a>
  );
}

function Articles({ theme, t }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter(a => a.platform === filter);

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, borderBottom: `1px solid ${theme.line}` }}>
      <SectionHeading theme={theme} t={t} num="03" label="writing" sub="// notes from the trenches" />

      <div style={{
        display: "flex", gap: 8, marginTop: 28, marginBottom: 16,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12
      }}>
        {["all", "medium"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "5px 12px",
              border: `1px solid ${filter === f ? theme.accent : theme.line}`,
              background: filter === f ? theme.accent : "transparent",
              color: filter === f ? theme.bg : theme.fg,
              fontFamily: "inherit", fontSize: 11,
              cursor: "default", letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}>
            {f} {filter === f && `[${filtered.length}]`}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span style={{ color: theme.dim, alignSelf: "center" }}>
          showing {filtered.length} of {ARTICLES.length}
        </span>
      </div>

      <div>
        {filtered.map((a, i) => <ArticleRow key={a.title} a={a} idx={i} theme={theme} />)}
      </div>
    </section>
  );
}

// ─── SHARED ─────────────────────────────────────────────────────────────────

function SectionHeading({ theme, t, num, label, sub }) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 16,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        <span style={{ fontSize: 12, color: theme.accent, letterSpacing: "0.18em" }}>
          ▸ {num}
        </span>
        <h2 style={{
          fontFamily: HEADING_FONTS[t.headingFont],
          fontSize: t.headingFont === "Press Start 2P" ? 22 : (t.headingFont === "Silkscreen" ? 28 : 48),
          margin: 0, color: theme.fg, lineHeight: 1
        }}>
          {label}
        </h2>
        <span style={{ flex: 1, height: 1, background: theme.line, marginBottom: 8 }} />
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
        color: theme.dim, marginTop: 8, marginLeft: t.headingFont === "Press Start 2P" ? 0 : 36
      }}>
        {sub}
      </div>
    </div>
  );
}

function Footer({ theme }) {
  return (
    <footer style={{
      paddingTop: 40, paddingBottom: 60,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
      color: theme.dim,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
    }}>
      <span>© {new Date().getFullYear()} mrkbr — built with care, shipped with caffeine</span>
      <span style={{ display: "flex", gap: 14 }}>
        <span>v2.0.4</span>
        <span style={{ color: theme.accent }}>● online</span>
      </span>
    </footer>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = THEMES[t.theme] || THEMES.acid;
  const isDark = t.theme !== "paper";

  const maxWidth = t.density === "compact" ? 760 : (t.density === "comfy" ? 980 : 880);

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg, color: theme.fg,
      fontFamily: "'JetBrains Mono', monospace",
      position: "relative", overflow: "hidden"
    }}>
      {t.scanlines && (
        <div aria-hidden style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: `repeating-linear-gradient(0deg, ${isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"} 0 1px, transparent 1px 3px)`,
          mixBlendMode: isDark ? "screen" : "multiply"
        }} />
      )}
      {t.scanlines && isDark && (
        <div aria-hidden style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          background: `radial-gradient(ellipse at center, transparent 50%, ${theme.bg} 120%)`
        }} />
      )}

      <div style={{ maxWidth, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 2 }}>
        <Hero theme={theme} t={t} />
        <Socials theme={theme} t={t} />
        <Articles theme={theme} t={t} />
        {t.showFooter && <Footer theme={theme} />}
      </div>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakSelect label="Palette" value={t.theme}
          options={[
            { value: "acid",  label: "Acid (yellow on black)" },
            { value: "amber", label: "Amber (CRT terminal)" },
            { value: "green", label: "Phosphor green" },
            { value: "cyan",  label: "Cyan / blueprint" },
            { value: "paper", label: "Paper (light)" }
          ]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakToggle label="Scanlines" value={t.scanlines}
          onChange={(v) => setTweak("scanlines", v)} />

        <TweakSection label="Typography" />
        <TweakSelect label="Heading font" value={t.headingFont}
          options={Object.keys(HEADING_FONTS).map(k => ({ value: k, label: k }))}
          onChange={(v) => setTweak("headingFont", v)} />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />

        <TweakSection label="Hero" />
        <TweakToggle label="Show avatar" value={t.showAvatar}
          onChange={(v) => setTweak("showAvatar", v)} />
        <TweakRadio label="Avatar" value={t.avatarStyle}
          options={["photo", "ascii", "grid", "mono"]}
          onChange={(v) => setTweak("avatarStyle", v)} />
        <TweakToggle label="Cursor blink" value={t.cursorBlink}
          onChange={(v) => setTweak("cursorBlink", v)} />
        <TweakToggle label="Status badge" value={t.showStatus}
          onChange={(v) => setTweak("showStatus", v)} />

        <TweakSection label="Misc" />
        <TweakToggle label="Footer" value={t.showFooter}
          onChange={(v) => setTweak("showFooter", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
