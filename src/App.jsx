import { useState, useEffect, useRef } from 'react';
import { Github, Mail, Phone, MapPin, ArrowUpRight, Folder, FileCode2, ExternalLink, Sun, Moon } from 'lucide-react';

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap';

/* ============================================================
   Theme: dark accent #EE2D2D · light accent #39CAE2
   Everything else (paper/ink structure, editor-file signature)
   stays the same across themes — only the accent + surfaces flip.
   ============================================================ */

const CSS = `
  :root{ --accent-dark:#EE2D2D; --accent-light:#39CAE2; }
  *{box-sizing:border-box;}
  .pf{font-family:'Inter',sans-serif;min-height:100vh;width:100%;transition:background .25s ease,color .25s ease;}
  .display{font-family:'Space Grotesk',sans-serif;}
  .mono{font-family:'JetBrains Mono',monospace;}
  html{scroll-behavior:smooth;background:#0B0B10;}
  html.theme-light{background:#F3F4F8;}
  body{overflow-x:hidden;}
  ::-webkit-scrollbar{width:10px;height:10px;}
  ::-webkit-scrollbar-track{background:var(--bg,#0B0B10);}
  ::-webkit-scrollbar-thumb{background:var(--line,#26273A);border-radius:6px;}
  ::-webkit-scrollbar-thumb:hover{background:var(--accent,#EE2D2D);}
  html{scrollbar-color:var(--line,#26273A) var(--bg,#0B0B10);}

  .pf.theme-light{
    --bg:#F3F4F8; --panel:#FFFFFF; --ink:#12131A; --dim:#63667A; --dim2:#9295A8;
    --line:#E1E3EC; --accent:#39CAE2; --accent-ink:#0E7490; --accent-tint:#E3F7FB;
  }
  .pf.theme-dark{
    --bg:#0B0B10; --panel:#15151E; --ink:#F1F1F5; --dim:#A7A9BC; --dim2:#6F7186;
    --line:#26273A; --accent:#EE2D2D; --accent-ink:#FF6B6B; --accent-tint:#2A1414;
  }
  .pf{background:var(--bg);color:var(--ink);}
  .pf ::selection{background:var(--accent);color:#fff;}

  .titlebar{position:sticky;top:0;z-index:40;background:color-mix(in srgb, var(--bg) 88%, transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
  .titlebar-inner{max-width:980px;margin:0 auto;padding:0 20px;height:52px;display:flex;align-items:center;gap:14px;}
  .dots{display:flex;gap:6px;}
  .dot{width:10px;height:10px;border-radius:50%;}
  .path{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim);}
  .tabs{margin-left:auto;display:none;gap:2px;}
  @media(min-width:820px){.tabs{display:flex;}}
  .tab{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim2);background:none;border:none;padding:8px 12px;cursor:pointer;border-bottom:2px solid transparent;}
  .tab:hover{color:var(--ink);}
  .tab.active{color:var(--accent-ink);border-bottom-color:var(--accent);}
  .theme-btn{margin-left:12px;width:32px;height:32px;border-radius:8px;border:1px solid var(--line);background:var(--panel);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink);flex-shrink:0;}
  .theme-btn:hover{border-color:var(--accent);color:var(--accent-ink);}

  .wrap{max-width:980px;margin:0 auto;padding:0 20px;position:relative;z-index:5;}
  .file{border:1px solid var(--line);background:var(--panel);border-radius:10px;overflow:hidden;}
  .file{transition:box-shadow .25s ease;}
  .pf.theme-light .file:hover{box-shadow:0 12px 30px rgba(18,19,26,0.14);}

  .filehead{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--line);font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim);}
  .code{display:flex;}
  .lines{padding:22px 14px;text-align:right;color:var(--dim2);opacity:.55;font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.9;user-select:none;border-right:1px solid var(--line);}
  .codebody{padding:22px 20px;font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.9;flex:1;overflow-x:auto;}
  .k{color:var(--ink);} .s{color:var(--accent-ink);} .c{color:var(--dim2);}
  .caret{display:inline-block;width:8px;height:17px;background:var(--accent);vertical-align:-3px;animation:blink 1s step-end infinite;margin-left:2px;}

  .hero-sec{padding:56px 0 40px;}
  .hero-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dim2);text-transform:uppercase;letter-spacing:.12em;}
  .status{display:flex;align-items:center;gap:6px;}
  .status .d{width:6px;height:6px;border-radius:50%;background:#2F9E6E;}
  .hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px;}
  .btn{font-family:'JetBrains Mono',monospace;font-size:13px;padding:10px 16px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;cursor:pointer;border:1px solid var(--line);transition:all .15s;}
  .btn-solid{background:var(--accent);color:#fff;border-color:var(--accent);}
  .btn-solid:hover{filter:brightness(1.08);}
  .btn-line{background:var(--panel);color:var(--ink);}
  .btn-line:hover{border-color:var(--accent);color:var(--accent-ink);}

  .section{padding:64px 0;border-top:1px solid var(--line);}
  .section-head{display:flex;align-items:baseline;gap:10px;margin-bottom:28px;}
  .section-head .fname{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent-ink);background:var(--accent-tint);padding:4px 10px;border-radius:6px;}
  .section-head h2{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;margin:0;}

  .md-line{display:flex;gap:18px;}
  .md-num{color:var(--dim2);opacity:.6;font-family:'JetBrains Mono',monospace;font-size:13px;padding-top:2px;min-width:16px;text-align:right;}
  .md-text{color:var(--dim);line-height:1.85;font-size:15px;}
  .md-text strong{color:var(--ink);}

  .traits{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px;}
  .trait{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent-ink);background:var(--accent-tint);padding:5px 10px;border-radius:6px;}

  .edu-grid{display:flex;flex-direction:column;}
  .edu-item{background:var(--panel);padding:18px 20px;border-top:1px solid var(--line);}
  .edu-item:first-child{border-top:none;}
  .edu-deg{font-weight:600;font-size:14px;margin-bottom:4px;}
  .edu-school{font-size:13px;color:var(--dim);}
  .edu-year{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-ink);margin-top:8px;}
  .lang-row{display:flex;gap:10px;padding:14px 20px;border-top:1px solid var(--line);font-size:13px;}
  .lang-row b{color:var(--ink);min-width:70px;}
  .lang-row span{color:var(--dim);}

  .json-block{font-family:'JetBrains Mono',monospace;font-size:14px;line-height:2;}
  .json-key{color:var(--ink);} .json-str{color:var(--accent-ink);} .json-punc{color:var(--dim2);}
  .dep-group{margin-bottom:6px;}

  .filerow{display:flex;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid var(--line);text-decoration:none;color:inherit;transition:background .15s;}
  .filerow:last-child{border-bottom:none;}
  .filerow:hover{background:var(--accent-tint);}
  .filerow .fn{font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--ink);}
  .filerow .fd{font-size:13px;color:var(--dim);margin-top:3px;}
  .filerow .ftag{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent-ink);background:var(--accent-tint);padding:3px 8px;border-radius:5px;white-space:nowrap;}
  .filerow .arrow{color:var(--dim2);transition:transform .15s, color .15s;}
  .filerow:hover .arrow{color:var(--accent-ink);transform:translate(2px,-2px);}

  .commit{padding:24px;}
  .commit-row{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim2);display:flex;flex-wrap:wrap;gap:6px 14px;margin-bottom:14px;}
  .commit-row b{color:var(--ink);}
  .commit-msg{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:19px;margin-bottom:14px;}
  .commit-body{color:var(--dim);font-size:14px;line-height:1.8;}
  .commit-body li{margin-bottom:6px;}

  .contact-block{text-align:center;padding:20px 0;}
  .contact-block h2{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:32px;margin-bottom:8px;}
  @media(min-width:640px){.contact-block h2{font-size:40px;}}
  .prompt-line{font-family:'JetBrains Mono',monospace;color:var(--dim);font-size:14px;margin-bottom:28px;}
  .prompt-line b{color:var(--accent-ink);}
  .contact-links{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}

  .footer{padding:24px 20px;border-top:1px solid var(--line);text-align:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--dim2);position:relative;z-index:5;}

  .rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1);}
  .rv.in{opacity:1;transform:translateY(0);}

  .splash-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;}

  @keyframes blink{0%,49%{opacity:1;}50%,100%{opacity:0;}}
`;

/* ---------- reveal on scroll ---------- */
const Reveal = ({ children, className = '', delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</div>;
};

/* ============================================================
   SplashCursor — canvas-based ink/fluid splash trail.
   (The original component used WebGL/ogl, unavailable here;
   this reproduces the same idea — colored splats that bloom
   and fade behind the pointer — with plain canvas 2D.)
   ============================================================ */
const SplashCursor = ({ color = '#39CAE2', blend = 'multiply' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastPos = useRef(null);
  const rafRef = useRef(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const hexToRgb = hex => {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };

    const spawn = (x, y, speed) => {
      const [r, g, b] = hexToRgb(colorRef.current);
      const count = Math.min(3, 1 + Math.floor(speed / 22));
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          r: 6 + Math.random() * 10 + Math.min(speed * 0.35, 40),
          maxR: 40 + Math.min(speed * 0.9, 130),
          alpha: 0.5,
          rgb: [r, g, b]
        });
      }
      if (particlesRef.current.length > 140) {
        particlesRef.current.splice(0, particlesRef.current.length - 140);
      }
    };

    const onMove = e => {
      const x = e.clientX, y = e.clientY;
      const last = lastPos.current;
      const speed = last ? Math.hypot(x - last.x, y - last.y) : 0;
      if (!last || speed > 4) spawn(x, y, speed);
      lastPos.current = { x, y };
    };
    const onTouch = e => {
      if (!e.touches || !e.touches[0]) return;
      onMove(e.touches[0]);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const arr = particlesRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.r += (p.maxR - p.r) * 0.06;
        p.alpha *= 0.955;
        if (p.alpha < 0.01) { arr.splice(i, 1); continue; }
        const [r, g, b] = p.rgb;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="splash-canvas" style={{ mixBlendMode: blend }} />;
};

/* ============================================================
   GlareHover — sweeping glare on hover, applied to every file box
   ============================================================ */
const GlareHover = ({
  children, className = '', style = {}, active = true,
  glareColor = '#ffffff', glareOpacity = 0.35, glareAngle = -30,
  glareSize = 300, transitionDuration = 800, playOnce = false
}) => {
  const overlayRef = useRef(null);

  if (!active) {
    return <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>{children}</div>;
  }

  const hex = glareColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  const rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    requestAnimationFrame(() => {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '100% 100%, 0 0';
    });
  };
  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '-100% -100%, 0 0';
    }
  };

  const overlayStyle = {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,100%,0) 60%, ${rgba} 70%, hsla(0,0%,100%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%, 0 0'
  };

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }} onMouseEnter={animateIn} onMouseLeave={animateOut}>
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </div>
  );
};

/* ---------- hero typing sequence ---------- */
const ROLES = ['"Frontend Developer"', '"React Engineer"', '"Next.js Builder"', '"Full Stack (in progress)"'];

const HeroCode = ({ theme }) => {
  const LINE1 = 'const developer = {';
  const [line1, setLine1] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleText, setRoleText] = useState('');
  const [phase, setPhase] = useState('typingLine1');

  useEffect(() => {
    if (phase !== 'typingLine1') return;
    if (line1.length < LINE1.length) {
      const t = setTimeout(() => setLine1(LINE1.slice(0, line1.length + 1)), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase('showRest'), 200);
    return () => clearTimeout(t);
  }, [line1, phase]);

  useEffect(() => {
    if (phase !== 'showRest') return;
    const t = setTimeout(() => setPhase('cycleRole'), 260);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'cycleRole') return;
    const target = ROLES[roleIdx];
    let i = 0;
    let typing = true;
    const timer = { current: null };
    const tick = () => {
      if (typing) {
        i++;
        setRoleText(target.slice(0, i));
        if (i >= target.length) { typing = false; timer.current = setTimeout(tick, 1500); return; }
      } else {
        setRoleIdx(p => (p + 1) % ROLES.length);
        setRoleText('');
        typing = true;
        i = 0;
        timer.current = setTimeout(tick, 400);
        return;
      }
      timer.current = setTimeout(tick, 45);
    };
    timer.current = setTimeout(tick, 300);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const restShown = phase === 'showRest' || phase === 'cycleRole';

  return (
    <GlareHover className="file" active={theme === 'dark'}>
      <div className="filehead"><FileCode2 size={13} /> hero.tsx</div>
      <div className="code">
        <div className="lines">{[1, 2, 3, 4, 5, 6].map(n => <div key={n}>{n}</div>)}</div>
        <div className="codebody">
          <div><span className="k">{line1}</span>{phase === 'typingLine1' && <span className="caret" />}</div>
          {restShown && <>
            <div>&nbsp;&nbsp;name: <span className="s">"Abhyanshu Raj"</span>,</div>
            <div>&nbsp;&nbsp;role: <span className="s">{roleText}</span>{phase === 'cycleRole' && <span className="caret" />},</div>
            <div>&nbsp;&nbsp;based_in: <span className="s">"Vaishali, Bihar"</span>,</div>
            <div>&nbsp;&nbsp;focus: <span className="s">"React → Full Stack"</span>,</div>
            <div><span className="k">{'};'}</span></div>
          </>}
        </div>
      </div>
    </GlareHover>
  );
};

/* ============================================================
   DATA
   ============================================================ */
const NAV = [
  { id: 'home', label: 'hero.tsx' },
  { id: 'about', label: 'about.md' },
  { id: 'education', label: 'education.json' },
  { id: 'skills', label: 'skill' },
  { id: 'work', label: '/projects' },
  { id: 'experience', label: 'git log' },
  { id: 'contact', label: 'contact' }
];

const aboutLines = [
  'Frontend-focused developer with a strong foundation in **React, Next.js and TypeScript**, transitioning into full stack development.',
  'Skilled at writing clean, maintainable code and building responsive, user-centric interfaces backed by well-structured logic.',
  'Committed to continuous learning, collaborative problem-solving, and delivering measurable value to a growing engineering team.'
];

const education = [
  { deg: 'Diploma in Computer Science & Engineering', school: 'Dr. C.V. Raman University, Bhagwanpur', year: '2026' },
  { deg: '12th (BSEB)', school: 'Akshyawat College, Mahua, Vaishali', year: '2023 · 60%' },
  { deg: '10th (CBSE)', school: 'Delhi Public School International, Garhan, Muzaffarpur', year: '2021 · 80%' }
];
const deps = [
  { group: 'dependencies', items: ['react', 'next', 'typescript', 'tailwindcss', 'html5', 'css3'] },
  { group: 'languages', items: ['javascript', 'c', 'c++'] },
  { group: 'backend', items: ['node', 'php', 'rest-apis', 'sql'] },
  { group: 'devDependencies', items: ['vs-code', 'git', 'github', 'postman', 'vercel', 'netlify', 'render'] }
];

const projects = [
  { file: 'wallpaper-discovery.jsx', tag: 'React', desc: 'Pinterest-style masonry grid with category-based browsing.' },
  { file: 'portfolio-site.jsx', tag: 'Tailwind', desc: 'Fully responsive, component-driven personal site.' },
  { file: 'habit-tracker.js', tag: 'LocalStorage', desc: 'Streaks, reminders and persistent progress tracking.' },
  { file: 'private-chat.js', tag: 'Realtime', desc: 'One-to-one chat secured by a unique access key.' },
  { file: 'sticky-notes.js', tag: 'LocalStorage', desc: 'Create, edit and delete notes with persistent state.' }
];

/* ============================================================
   MAIN
   ============================================================ */
export default function Portfolio() {
  const [active, setActive] = useState('home');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);
  const refs = useRef({});
  const scrollTo = id => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const obs = NAV.map(({ id }) => {
      const el = refs.current[id];
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => e.isIntersecting && setActive(id), {
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0
      });
      io.observe(el);
      return io;
    });
    return () => obs.forEach(o => o && o.disconnect());
  }, []);

  const accent = theme === 'dark' ? '#EE2D2D' : '#39CAE2';
  const blend = theme === 'dark' ? 'screen' : 'multiply';

  return (
    <div className={`pf theme-${theme}`}>
      <link rel="stylesheet" href={FONT_LINK} />
      <style>{CSS}</style>

      <SplashCursor color={accent} blend={blend} />

      <div className="titlebar">
        <div className="titlebar-inner">
          <div className="dots">
            <span className="dot" style={{ background: '#FF5F57' }} />
            <span className="dot" style={{ background: '#FEBC2E' }} />
            <span className="dot" style={{ background: '#28C840' }} />
          </div>
          <span className="path">~/abhyanshu-raj/portfolio</span>
          <div className="tabs">
            {NAV.map(({ id, label }) => (
              <button key={id} className={`tab ${active === id ? 'active' : ''}`} onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>
          <button className="theme-btn" onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      <div className="wrap">
        {/* ================= HERO ================= */}
        <section ref={el => (refs.current.home = el)} className="hero-sec">
          <div className="hero-meta">
            <span>frontend developer</span>
            <span className="status"><span className="d" /> available for work</span>
          </div>
          <HeroCode theme={theme} />
          <div className="hero-cta">
            <a className="btn btn-solid" onClick={() => scrollTo('work')}>$ view-work <ArrowUpRight size={14} /></a>
            <a className="btn btn-line" href="https://github.com/abhyanshu2" target="_blank" rel="noreferrer"><Github size={14} /> github.com/abhyanshu2</a>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section ref={el => (refs.current.about = el)} className="section">
          <Reveal>
            <div className="section-head"><span className="fname">about.md</span><h2 className="display">About</h2></div>
          </Reveal>
          <Reveal delay={0.1}>
          <GlareHover className="file" active={theme === 'dark'}>
            <div className="filehead">README preview</div>
            <div style={{ padding: '20px 20px' }}>
              {aboutLines.map((line, i) => (
                <div key={i} className="md-line" style={{ marginBottom: 14 }}>
                  <span className="md-num">{i + 1}</span>
                  <span className="md-text" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
              <div className="traits">
                {['Problem-solving', 'Fast learner', 'Detail-oriented', 'Team collaboration', 'Self-driven ownership'].map(t => (
                  <span key={t} className="trait">#{t.replace(/\s+/g, '-').toLowerCase()}</span>
                ))}
              </div>
            </div>
          </GlareHover>
          </Reveal>
        </section>

        {/* ================= EDUCATION ================= */}
        <section ref={el => (refs.current.education = el)} className="section">
          <Reveal>
            <div className="section-head"><span className="fname">education.json</span><h2 className="display">Education</h2></div>
          </Reveal>
          <Reveal delay={0.1}>
          <GlareHover className="file" active={theme === 'dark'}>
            <div className="filehead">academic record</div>
            <div className="edu-grid">
              {education.map(e => (
                <div key={e.deg} className="edu-item">
                  <div className="edu-deg">{e.deg}</div>
                  <div className="edu-school">{e.school}</div>
                  <div className="edu-year">{e.year}</div>
                </div>
              ))}
            </div>
          </GlareHover>
          </Reveal>
        </section>

        {/* ================= SKILLS ================= */}
        <section ref={el => (refs.current.skills = el)} className="section">
          <Reveal>
            <div className="section-head"><span className="fname">package.json</span><h2 className="display">Skills</h2></div>
          </Reveal>
          <Reveal delay={0.1}>
          <GlareHover className="file" active={theme === 'dark'}>
            <div className="filehead">dependency manifest</div>
            <div style={{ padding: '22px 24px' }}>
              <div className="json-block">
                <div><span className="json-punc">{'{'}</span></div>
                {deps.map((d, di) => (
                  <div key={d.group} className="dep-group">
                    <div>&nbsp;&nbsp;<span className="json-key">"{d.group}"</span><span className="json-punc">: {'{'}</span></div>
                    {d.items.map((it, i) => (
                      <div key={it}>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="json-key">"{it}"</span><span className="json-punc">: </span><span className="json-str">"latest"</span>{i < d.items.length - 1 ? <span className="json-punc">,</span> : ''}
                      </div>
                    ))}
                    <div>&nbsp;&nbsp;<span className="json-punc">{'}'}{di < deps.length - 1 ? ',' : ''}</span></div>
                  </div>
                ))}
                <div><span className="json-punc">{'}'}</span></div>
              </div>
            </div>
          </GlareHover>
          </Reveal>
        </section>

        {/* ================= PROJECTS ================= */}
        <section ref={el => (refs.current.work = el)} className="section">
          <Reveal>
            <div className="section-head"><span className="fname">/projects</span><h2 className="display">Work</h2></div>
          </Reveal>
          <Reveal delay={0.1}>
          <GlareHover className="file" active={theme === 'dark'}>
            <div className="filehead"><Folder size={13} /> ls -la ./projects</div>
            <div>
              {projects.map(p => (
                <div key={p.file} className="filerow">
                  <FileCode2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fn">{p.file}</div>
                    <div className="fd">{p.desc}</div>
                  </div>
                  <span className="ftag">{p.tag}</span>
                  <ArrowUpRight size={16} className="arrow" />
                </div>
              ))}
            </div>
          </GlareHover>
          </Reveal>
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section ref={el => (refs.current.experience = el)} className="section">
          <Reveal>
            <div className="section-head"><span className="fname">git log</span><h2 className="display">Experience</h2></div>
          </Reveal>
          <Reveal delay={0.1}>
          <GlareHover className="file commit" active={theme === 'dark'}>
            <div className="commit-row">
              <span>commit <b>a1b2c3d</b></span>
              <span>Author: <b>Sysnet Global Technologies</b></span>
              <span>Date: <b>Feb 2026 – May 2026</b></span>
            </div>
            <div className="commit-msg">Support Operations Intern — Jaipur, Rajasthan</div>
            <ul className="commit-body">
              <li>+ 3-month internship in Support Operations for System Software — hands-on with HTML, React and Java.</li>
              <li>+ Demonstrated strong learning ability, dedication and a positive attitude throughout.</li>
              <li>+ Recognized for sincerity, hard work and promising potential.</li>
            </ul>
          </GlareHover>
          </Reveal>
        </section>

        {/* ================= CONTACT ================= */}
        <section ref={el => (refs.current.contact = el)} className="section">
          <Reveal className="contact-block">
            <div className="prompt-line"><b>$</b> whoami --contact</div>
            <h2 className="display">Let's build something.</h2>
            <p style={{ color: 'var(--dim)', maxWidth: 420, margin: '0 auto 28px' }}>Open to frontend and full stack roles — reply within a day.</p>
            <div className="contact-links">
              <a className="btn btn-solid" href="mailto:abhyanshu2@gmail.com"><Mail size={14} /> abhyanshu2@gmail.com</a>
              <a className="btn btn-line" href="tel:+916206358342"><Phone size={14} /> +91 6206358342</a>
              <a className="btn btn-line" href="https://github.com/abhyanshu2" target="_blank" rel="noreferrer"><ExternalLink size={14} /> abhyanshu2</a>
            </div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--dim2)', fontSize: 13 }}>
              <MapPin size={13} /> Vaishali, Bihar, India
            </div>
          </Reveal>
        </section>

        <div className="footer">© 2026 Abhyanshu Raj — index.tsx, last commit today.</div>
      </div>
    </div>
  );
}
