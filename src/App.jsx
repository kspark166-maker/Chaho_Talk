import { useState, useRef, useCallback, useEffect } from "react";

// ── Fonts
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=M+PLUS+Rounded+1c:wght@900&display=swap";
document.head.appendChild(fl);

// ══════════════════════════════════════════════════════════════════════════
// THEMES（大人っぽくリファイン）
// ══════════════════════════════════════════════════════════════════════════
const THEMES = {
  chaho: {
    name:"チャホ！", icon:"🌊",
    "--t1":"#5bc8d4","--t1d":"#2d9aa8","--t1p":"#edf8fa",
    "--t2":"#c0524a","--t2d":"#9a3830","--t2p":"#faecea",
    "--bg":"#f5f7f8","--card":"rgba(255,255,255,.95)",
    "--ink":"#1e2428","--mid":"#6b7a80","--light":"#b0bec5","--shadow":"rgba(30,80,90,0.10)",
    "--hbg":"rgba(255,255,255,.95)","--hborder":"rgba(91,200,212,.18)",
    "--grad":"linear-gradient(160deg,#eaf7f9 0%,#f5f7f8 45%,#faf0ee 100%)",
    "--btnme":"linear-gradient(135deg,#c0524a,#9a3830)",
    "--btnnav":"linear-gradient(135deg,#5bc8d4,#2d9aa8)",
    "--dot":"#5bc8d4","--dotbar":"linear-gradient(90deg,#5bc8d4,#c0524a)",
  },
  chic: {
    name:"シック", icon:"◼",
    "--t1":"#9e9e9e","--t1d":"#616161","--t1p":"rgba(100,100,100,.12)",
    "--t2":"#78909c","--t2d":"#546e7a","--t2p":"rgba(84,110,122,.12)",
    "--bg":"#181c1f","--card":"rgba(32,36,40,.98)",
    "--ink":"#eceff1","--mid":"#90a4ae","--light":"#546e7a","--shadow":"rgba(0,0,0,0.45)",
    "--hbg":"rgba(24,28,31,.98)","--hborder":"rgba(144,164,174,.18)",
    "--grad":"linear-gradient(160deg,#181c1f 0%,#1e2428 60%,#181c1f 100%)",
    "--btnme":"linear-gradient(135deg,#546e7a,#37474f)",
    "--btnnav":"linear-gradient(135deg,#78909c,#546e7a)",
    "--dot":"#78909c","--dotbar":"linear-gradient(90deg,#78909c,#546e7a)",
  },
  warm: {
    name:"暖かい", icon:"🍂",
    "--t1":"#bf8a5e","--t1d":"#a0693a","--t1p":"#fdf3eb",
    "--t2":"#a05060","--t2d":"#7d3245","--t2p":"#faedef",
    "--bg":"#faf6f2","--card":"rgba(255,255,255,.95)",
    "--ink":"#2a1f18","--mid":"#7a6050","--light":"#c4a882","--shadow":"rgba(80,40,20,0.10)",
    "--hbg":"rgba(255,255,255,.95)","--hborder":"rgba(191,138,94,.2)",
    "--grad":"linear-gradient(160deg,#fdf3eb 0%,#faf6f2 50%,#faedef 100%)",
    "--btnme":"linear-gradient(135deg,#a05060,#7d3245)",
    "--btnnav":"linear-gradient(135deg,#bf8a5e,#a0693a)",
    "--dot":"#bf8a5e","--dotbar":"linear-gradient(90deg,#bf8a5e,#a05060)",
  },
  fresh: {
    name:"爽やか", icon:"🌿",
    "--t1":"#4db6ac","--t1d":"#00897b","--t1p":"#e0f2f1",
    "--t2":"#5c8a6e","--t2d":"#3d6b52","--t2p":"#e8f5e9",
    "--bg":"#f4faf8","--card":"rgba(255,255,255,.95)",
    "--ink":"#1b2d28","--mid":"#587068","--light":"#90bdb0","--shadow":"rgba(0,100,80,0.09)",
    "--hbg":"rgba(255,255,255,.95)","--hborder":"rgba(77,182,172,.2)",
    "--grad":"linear-gradient(160deg,#e0f2f1 0%,#f4faf8 50%,#e8f5e9 100%)",
    "--btnme":"linear-gradient(135deg,#5c8a6e,#3d6b52)",
    "--btnnav":"linear-gradient(135deg,#4db6ac,#00897b)",
    "--dot":"#4db6ac","--dotbar":"linear-gradient(90deg,#4db6ac,#5c8a6e)",
  },
  navy: {
    name:"ネイビー", icon:"🌙",
    "--t1":"#7986cb","--t1d":"#5c6bc0","--t1p":"#e8eaf6",
    "--t2":"#ef9a9a","--t2d":"#e57373","--t2p":"#fce4ec",
    "--bg":"#f3f4f8","--card":"rgba(255,255,255,.95)",
    "--ink":"#1a1d2e","--mid":"#6670a0","--light":"#b0b8d8","--shadow":"rgba(30,40,100,0.10)",
    "--hbg":"rgba(255,255,255,.95)","--hborder":"rgba(121,134,203,.2)",
    "--grad":"linear-gradient(160deg,#e8eaf6 0%,#f3f4f8 50%,#fce4ec 100%)",
    "--btnme":"linear-gradient(135deg,#ef9a9a,#e57373)",
    "--btnnav":"linear-gradient(135deg,#7986cb,#5c6bc0)",
    "--dot":"#7986cb","--dotbar":"linear-gradient(90deg,#7986cb,#ef9a9a)",
  },
};

const applyTheme = tid => {
  const t = THEMES[tid] || THEMES.chaho;
  Object.entries(t).forEach(([k,v]) => { if (k.startsWith("--")) document.documentElement.style.setProperty(k, v); });
};

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --t1:#5bc8d4;--t1d:#2d9aa8;--t1p:#edf8fa;
    --t2:#c0524a;--t2d:#9a3830;--t2p:#faecea;
    --bg:#f5f7f8;--card:rgba(255,255,255,.95);
    --ink:#1e2428;--mid:#6b7a80;--light:#b0bec5;--shadow:rgba(30,80,90,0.10);
    --hbg:rgba(255,255,255,.95);--hborder:rgba(91,200,212,.18);
    --grad:linear-gradient(160deg,#eaf7f9 0%,#f5f7f8 45%,#faf0ee 100%);
    --btnme:linear-gradient(135deg,#c0524a,#9a3830);
    --btnnav:linear-gradient(135deg,#5bc8d4,#2d9aa8);
    --dot:#5bc8d4;--dotbar:linear-gradient(90deg,#5bc8d4,#c0524a);
    --font:'Noto Sans JP','Nunito',sans-serif;
    --radius:14px;
  }
  body{font-family:var(--font);color:var(--ink);overscroll-behavior:none;background:var(--bg);-webkit-tap-highlight-color:transparent;}
  textarea:focus,input:focus,button:focus{outline:none;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:var(--t1);border-radius:2px;opacity:.5;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes float2{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
  @keyframes blink {0%,88%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
  @keyframes wag   {0%,100%{transform:rotate(0)}25%{transform:rotate(16deg)}75%{transform:rotate(-12deg)}}
  @keyframes shake {0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-4px)}50%{transform:translateX(4px)}}
  @keyframes slideInR{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}
  @keyframes slideInL{from{transform:translateX(-100%);opacity:0}to{transform:none;opacity:1}}
  @keyframes spin  {to{transform:rotate(360deg)}}
  @keyframes pulse {0%,100%{opacity:.5}50%{opacity:1}}
  @keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
`;
const injectCSS = c => { const s = document.createElement("style"); s.textContent = c; document.head.appendChild(s); };
injectCSS(CSS);

// ══════════════════════════════════════════════════════════════════════════
// LOGO（常に固定位置・読みやすい）
// ══════════════════════════════════════════════════════════════════════════
const ChahoLogo = ({ size = "md" }) => {
  const fs = size === "lg" ? 40 : size === "sm" ? 17 : 28;
  const sw = size === "lg" ? 7  : size === "sm" ? 3  : 5;
  const makeShadow = w => {
    const s = [];
    for (let x = -w; x <= w; x++) for (let y = -w; y <= w; y++) {
      if (x === 0 && y === 0) continue;
      s.push(`${x}px ${y}px 0 white`);
    }
    return s.join(",");
  };
  const base = {
    fontFamily: "'M PLUS Rounded 1c','Noto Sans JP',sans-serif",
    fontWeight: 900, fontSize: fs, lineHeight: 1, display: "inline-block",
    textShadow: makeShadow(sw), WebkitTextStroke: `${sw * 0.4}px white`, paintOrder: "stroke fill",
    filter: "drop-shadow(0 1.5px 2px rgba(0,0,0,0.18))",
  };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap: size==="lg"?3:2, lineHeight:1 }}>
      <span style={{ ...base, color:"#5bc8d4" }}>チャ</span>
      <span style={{ ...base, color:"#c0524a" }}>ホ</span>
      <span style={{ ...base, color:"#5bc8d4" }}>！</span>
    </span>
  );
};

// ── SVG キャラ（常に水色×茜色）
const PupSVG = ({ size=80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <ellipse cx="26" cy="30" rx="14" ry="19" fill="#5bc8d4" transform="rotate(-15 26 30)"/>
    <ellipse cx="50" cy="72" rx="26" ry="20" fill="white"/>
    <circle cx="50" cy="44" r="26" fill="white"/>
    <ellipse cx="58" cy="52" rx="12" ry="8" fill="white"/>
    <ellipse cx="63" cy="50" rx="6" ry="4" fill="#2a2a2a"/>
    <ellipse cx="42" cy="40" rx="4" ry="4.5" fill="#2a2a2a" style={{animation:"blink 4s infinite"}}/>
    <ellipse cx="56" cy="40" rx="4" ry="4.5" fill="#2a2a2a" style={{animation:"blink 4s .15s infinite"}}/>
    <circle cx="43.5" cy="38.5" r="1.5" fill="white"/><circle cx="57.5" cy="38.5" r="1.5" fill="white"/>
    <path d="M76 68 Q90 55 84 45" stroke="#3ab0bc" strokeWidth="5" strokeLinecap="round" fill="none"
      style={{animation:"wag 1.2s ease-in-out infinite",transformOrigin:"76px 68px"}}/>
    <circle cx="38" cy="50" r="5" fill="#e0f7fa" opacity=".8"/>
    <circle cx="65" cy="50" r="5" fill="#e0f7fa" opacity=".8"/>
    <path d="M52 56 Q56 61 62 58" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);
const BotSVG = ({ size=80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="75" rx="28" ry="18" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
    <rect x="43" y="54" width="14" height="10" rx="7" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
    <circle cx="50" cy="40" r="28" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
    <line x1="50" y1="13" x2="50" y2="5" stroke="#c0524a" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="4" r="3.5" fill="#c0524a"/>
    <rect x="30" y="35" width="40" height="10" rx="5" fill="#c0524a" opacity=".18"/>
    <rect x="34" y="37" width="32" height="6" rx="3" fill="#c0524a" opacity=".5"/>
    <rect x="36" y="37.5" width="10" height="5" rx="2.5" fill="#9a3830"/>
    <rect x="54" y="37.5" width="10" height="5" rx="2.5" fill="#9a3830"/>
    <path d="M38 52 Q50 57 62 52" stroke="#d0a0a0" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="16" cy="72" rx="8" ry="12" fill="white" stroke="#e8d0ce" strokeWidth="1.5" transform="rotate(15 16 72)"/>
    <ellipse cx="84" cy="72" rx="8" ry="12" fill="white" stroke="#e8d0ce" strokeWidth="1.5" transform="rotate(-15 84 72)"/>
    <circle cx="34" cy="46" r="4.5" fill="#faecea" opacity=".8"/>
    <circle cx="66" cy="46" r="4.5" fill="#faecea" opacity=".8"/>
    <path d="M46 72 C46 70 50 67 50 70 C50 67 54 70 54 72 C54 75 50 78 50 78 C50 78 46 75 46 72Z" fill="#c0524a" opacity=".5"/>
  </svg>
);

const BgDecor = () => (
  <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    <div style={{position:"absolute",inset:0,background:"var(--grad)"}}/>
    <div style={{position:"absolute",bottom:50,left:-8,opacity:.1}}><PupSVG size={110}/></div>
    <div style={{position:"absolute",top:40,right:-8,opacity:.09}}><BotSVG size={100}/></div>
  </div>
);

// ── helpers
const fmt     = ts => new Date(ts).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
const fmtDate = ts => new Date(ts).toLocaleDateString("ja-JP",{month:"long",day:"numeric"});

// ── Btn helper
const Btn = ({ onClick, children, style={}, variant="primary", small=false }) => {
  const base = {
    border:"none", borderRadius: small ? 8 : 10, cursor:"pointer",
    fontFamily:"var(--font)", fontWeight:600,
    fontSize: small ? 12 : 13,
    padding: small ? "5px 12px" : "8px 18px",
    transition:"all .15s", lineHeight:1.4,
  };
  const variants = {
    primary:   { background:"var(--btnnav)", color:"white" },
    secondary: { background:"var(--btnme)",  color:"white" },
    ghost:     { background:"rgba(128,128,128,.1)", color:"var(--ink)", border:"1px solid rgba(128,128,128,.18)" },
    danger:    { background:"rgba(200,80,70,.1)",   color:"var(--t2d)", border:"1px solid rgba(200,80,70,.2)" },
  };
  return <button onClick={onClick} style={{...base,...variants[variant],...style}}>{children}</button>;
};

// ── init data（プロフ名前は空）
const INIT_MSGS = [
  {id:1,from:"them",type:"text",body:"おはよう ☀️",ts:Date.now()-86400000,read:true},
  {id:2,from:"me",  type:"text",body:"おはよう！今日もよろしく",ts:Date.now()-86000000,read:true},
  {id:3,from:"them",type:"text",body:"今日どこ行く？",ts:Date.now()-3600000,read:false},
];
const INIT_NOTES = [
  {id:1,title:"行きたい場所リスト",body:"京都・奈良\n北海道（冬）\n沖縄の離島",ts:Date.now()-100000,author:"them"},
  {id:2,title:"記念日メモ",body:"最初に会った日: 3月15日\n初デート: 4月2日",ts:Date.now()-50000,author:"me"},
];
const INIT_ALBUMS = [
  { id:1, name:"思い出", photos:[] },
];
const INIT_PROFILES = {
  me:   { name:"", nickname:"", birthday:"", birthplace:"", job:"", story:"", hobbies:"", likes:"", food:"", alcohol:"", emoji:"" },
  them: { name:"", nickname:"", birthday:"", birthplace:"", job:"", story:"", hobbies:"", likes:"", food:"", alcohol:"", emoji:"" },
};
const DEFAULT_PROF_FIELDS = [
  {key:"name",      label:"名前",         icon:"👤", multi:false},
  {key:"nickname",  label:"ニックネーム", icon:"💬", multi:false},
  {key:"birthday",  label:"誕生日",       icon:"🎂", multi:false},
  {key:"birthplace",label:"出身地",       icon:"📍", multi:false},
  {key:"job",       label:"職業",         icon:"💼", multi:false},
  {key:"story",     label:"生い立ち",     icon:"📖", multi:true},
  {key:"hobbies",   label:"趣味",         icon:"🎨", multi:false},
  {key:"likes",     label:"好きなこと",   icon:"❤️", multi:false},
  {key:"food",      label:"好きな食べ物", icon:"🍜", multi:false},
  {key:"alcohol",   label:"好きなお酒",   icon:"🍷", multi:false},
];
const INIT_KIROKU = [
  {id:1,cat:"rule", title:"週1回は必ず会う",body:"どんなに忙しくても週1デートは守る約束",ts:Date.now()-200000,author:"me"},
  {id:2,cat:"quote",title:"茜の名言",body:"「好きって言いたいけど恥ずかしい」",ts:Date.now()-100000,author:"them"},
];

// ══════════════════════════════════════════════════════════════════════════
// LOCK SCREEN
// ══════════════════════════════════════════════════════════════════════════
const LockScreen = ({ onUnlock, pin: savedPin }) => {
  const [pin,setPin]     = useState("");
  const [shake,setShake] = useState(false);
  const [hint,setHint]   = useState(false);
  const press = d => {
    if (pin.length >= 4) return;
    const next = pin + d; setPin(next);
    if (next.length === 4) {
      if (next === savedPin) setTimeout(() => onUnlock(), 260);
      else { setShake(true); setTimeout(() => { setPin(""); setShake(false); }, 650); }
    }
  };
  const KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return (
    <div style={{position:"relative",height:"100%",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:28,overflow:"hidden",background:"var(--grad)"}}>
      <BgDecor/>
      <div style={{position:"absolute",left:"4%",bottom:"8%",animation:"float 3.2s ease-in-out infinite",zIndex:1}}><PupSVG size={72}/></div>
      <div style={{position:"absolute",right:"3%",top:"12%",animation:"float2 3.8s ease-in-out infinite",zIndex:1}}><BotSVG size={68}/></div>
      <div style={{position:"relative",zIndex:2,background:"var(--card)",backdropFilter:"blur(20px)",
        borderRadius:24,padding:"28px 32px",boxShadow:"0 6px 32px var(--shadow)",
        border:"1px solid rgba(255,255,255,.8)",display:"flex",flexDirection:"column",alignItems:"center",gap:20,minWidth:270}}>
        <ChahoLogo size="lg"/>
        <div style={{display:"flex",gap:14,animation:shake?"shake .6s":"none"}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{width:13,height:13,borderRadius:"50%",transition:"all .15s",
              background:i<pin.length?"var(--t1)":"transparent",border:"2px solid",
              borderColor:i<pin.length?"var(--t1)":"var(--light)",
              boxShadow:i<pin.length?"0 0 6px var(--t1p)":"none"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,60px)",gap:8}}>
          {KEYS.map((k,i) => (
            <button key={i} onClick={() => k==="⌫" ? setPin(p=>p.slice(0,-1)) : k ? press(k) : null}
              style={{height:60,borderRadius:16,background:k?"rgba(128,128,128,.08)":"transparent",
                border:k?"1px solid rgba(128,128,128,.15)":"none",color:"var(--ink)",
                fontSize:k==="⌫"?15:19,fontFamily:"var(--font)",fontWeight:700,
                cursor:k?"pointer":"default",transition:"all .1s"}}
              onMouseEnter={e => k && (e.currentTarget.style.background="rgba(128,128,128,.18)")}
              onMouseLeave={e => k && (e.currentTarget.style.background="rgba(128,128,128,.08)")}
            >{k}</button>
          ))}
        </div>
        <button onClick={() => setHint(!hint)}
          style={{background:"none",border:"none",color:"var(--light)",fontSize:11,cursor:"pointer",fontFamily:"var(--font)"}}>
          {hint ? `PIN: ${savedPin}（デモ用）` : "PINを忘れた場合"}
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// CHAT TAB（既読対応）
// ══════════════════════════════════════════════════════════════════════════
const PupMini = () => (
  <svg viewBox="0 0 100 100" width="26" height="26">
    <ellipse cx="26" cy="30" rx="14" ry="19" fill="#5bc8d4" transform="rotate(-15 26 30)"/>
    <circle cx="50" cy="44" r="26" fill="white"/>
    <ellipse cx="58" cy="52" rx="12" ry="8" fill="white"/>
    <ellipse cx="63" cy="50" rx="6" ry="4" fill="#2a2a2a"/>
    <ellipse cx="42" cy="40" rx="4" ry="4.5" fill="#2a2a2a"/>
    <ellipse cx="56" cy="40" rx="4" ry="4.5" fill="#2a2a2a"/>
    <circle cx="38" cy="50" r="5" fill="#e0f7fa" opacity=".8"/>
  </svg>
);
const BotMini = () => (
  <svg viewBox="0 0 100 100" width="26" height="26">
    <circle cx="50" cy="40" r="28" fill="white" stroke="#e8d0ce" strokeWidth="2"/>
    <rect x="34" y="37" width="32" height="6" rx="3" fill="#9a3830" opacity=".6"/>
    <circle cx="34" cy="46" r="4" fill="#faecea" opacity=".8"/>
    <circle cx="66" cy="46" r="4" fill="#faecea" opacity=".8"/>
    <path d="M38 52 Q50 57 62 52" stroke="#d0a0a0" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const Bubble = ({ msg, onRead }) => {
  const me = msg.from === "me";
  useEffect(() => { if (!me && !msg.read) { const t = setTimeout(() => onRead(msg.id), 1500); return () => clearTimeout(t); } }, []);
  return (
    <div style={{display:"flex",justifyContent:me?"flex-end":"flex-start",animation:"fadeUp .25s ease"}}>
      {!me && <div style={{width:26,height:26,marginRight:6,flexShrink:0,marginTop:"auto"}}><PupMini/></div>}
      <div style={{maxWidth:"66%",
        background:me?"var(--btnme)":"var(--card)",color:me?"white":"var(--ink)",
        borderRadius:me?"18px 18px 4px 18px":"18px 18px 18px 4px",
        padding:msg.type==="image"?3:"8px 12px",
        boxShadow:"0 1px 6px var(--shadow)",overflow:"hidden",
        border:me?"none":"1px solid rgba(128,128,128,.08)"}}>
        {msg.type==="image"
          ? <img src={msg.body} alt="" style={{display:"block",width:"100%",maxWidth:200,borderRadius:12}}/>
          : <span style={{fontSize:14,lineHeight:1.6,fontWeight:500}}>{msg.body}</span>
        }
        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3,
          marginTop:msg.type==="image"?2:3,paddingRight:msg.type==="image"?5:0}}>
          <span style={{fontSize:10,color:me?"rgba(255,255,255,.6)":"var(--light)"}}>{fmt(msg.ts)}</span>
          {me && <span style={{fontSize:10,color:msg.read?"#5bc8d4":"rgba(255,255,255,.4)",fontWeight:700}}>
            {msg.read ? "既読" : "　"}
          </span>}
        </div>
      </div>
      {me && <div style={{width:26,height:26,marginLeft:6,flexShrink:0,marginTop:"auto"}}><BotMini/></div>}
    </div>
  );
};

const REPLIES = ["そうだね😊","わかる！","ありがとう","え、ほんとに？","いいね","またね","楽しみ！","好きだよ","うれしい😊","ほんとに？！"];
const ChatTab = ({ messages, setMessages }) => {
  const [text, setText] = useState("");
  const endRef = useRef();
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const markRead = id => setMessages(m => m.map(x => x.id === id ? { ...x, read:true } : x));

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id:Date.now(), from:"me", type:"text", body:text.trim(), ts:Date.now(), read:false }]);
    setText("");
    setTimeout(() => {
      setMessages(m => [...m, {
        id: Date.now()+1, from:"them", type:"text",
        body: REPLIES[Math.floor(Math.random()*REPLIES.length)], ts:Date.now(), read:false
      }]);
    }, 900 + Math.random()*600);
  };

  const groups = []; let ld = null;
  messages.forEach(msg => {
    const d = fmtDate(msg.ts);
    if (d !== ld) { groups.push({ type:"date", label:d }); ld = d; }
    groups.push({ type:"msg", msg });
  });

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",padding:"12px 10px",display:"flex",flexDirection:"column",gap:8}}>
        {groups.map((g,i) => g.type==="date"
          ? <div key={i} style={{textAlign:"center",fontSize:10,color:"var(--mid)",margin:"4px 0",
              display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,height:1,background:"rgba(128,128,128,.12)"}}/>
              <span style={{background:"var(--card)",padding:"2px 9px",borderRadius:10,fontWeight:600,border:"1px solid rgba(128,128,128,.1)"}}>{g.label}</span>
              <div style={{flex:1,height:1,background:"rgba(128,128,128,.12)"}}/>
            </div>
          : <Bubble key={g.msg.id} msg={g.msg} onRead={markRead}/>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"8px 10px 12px",background:"var(--hbg)",backdropFilter:"blur(16px)",
        borderTop:"1px solid var(--hborder)",display:"flex",gap:7,alignItems:"flex-end"}}>
        <textarea value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); send(); }}}
          rows={1} placeholder="メッセージ…"
          style={{flex:1,resize:"none",border:"1px solid var(--hborder)",borderRadius:18,
            padding:"9px 13px",fontFamily:"var(--font)",fontSize:13,fontWeight:500,
            background:"var(--t1p)",color:"var(--ink)",lineHeight:1.5,maxHeight:80}}/>
        <button onClick={send}
          style={{width:36,height:36,borderRadius:18,border:"none",flexShrink:0,
            background:text.trim()?"var(--btnme)":"var(--light)",color:"white",
            fontSize:16,cursor:text.trim()?"pointer":"default",transition:"background .2s",
            display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// NOTES TAB
// ══════════════════════════════════════════════════════════════════════════
const NotesTab = ({ notes, setNotes, profiles }) => {
  const [active, setActive] = useState(null);
  const [form, setForm]     = useState({ title:"", body:"" });
  const nameMe   = profiles.me.name   || "自分";
  const nameThem = profiles.them.name || "相手";

  const save = () => {
    if (!form.title.trim() && !form.body.trim()) { setActive(null); return; }
    if (active === "new") setNotes(n => [...n, { id:Date.now(), ...form, ts:Date.now(), author:"me" }]);
    else setNotes(n => n.map(x => x.id===active ? { ...x, ...form, ts:Date.now() } : x));
    setActive(null);
  };

  if (active !== null) return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",animation:"fadeIn .2s"}}>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
        <Btn onClick={() => setActive(null)} variant="ghost" small>← 戻る</Btn>
        <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="タイトル"
          style={{flex:1,fontFamily:"var(--font)",fontSize:15,fontWeight:700,border:"none",background:"none",color:"var(--ink)"}}/>
        <Btn onClick={save} small>保存</Btn>
      </div>
      <textarea value={form.body} onChange={e => setForm(f=>({...f,body:e.target.value}))} placeholder="ここに書く…"
        style={{flex:1,padding:"14px",resize:"none",border:"none",fontFamily:"var(--font)",
          fontSize:14,lineHeight:1.9,background:"transparent",color:"var(--ink)",fontWeight:500}}/>
    </div>
  );

  return (
    <div style={{padding:14,overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:700,color:"var(--ink)"}}>ノート</div>
        <Btn onClick={() => { setActive("new"); setForm({title:"",body:""}); }} small>＋ 新規</Btn>
      </div>
      {notes.length === 0 && (
        <div style={{textAlign:"center",color:"var(--light)",fontSize:13,marginTop:50}}>
          <div style={{fontSize:32,marginBottom:8}}>📝</div>まだノートがありません
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {notes.map(n => (
          <div key={n.id} onClick={() => { setActive(n.id); setForm({title:n.title,body:n.body}); }}
            style={{background:"var(--card)",borderRadius:12,padding:"12px 14px",
              boxShadow:"0 1px 6px var(--shadow)",cursor:"pointer",
              border:"1px solid rgba(128,128,128,.08)",animation:"fadeUp .25s ease",position:"relative"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:"var(--ink)"}}>{n.title||"無題"}</div>
            <div style={{fontSize:12,color:"var(--mid)",lineHeight:1.6}}>
              {n.body.slice(0,55)}{n.body.length>55?"…":""}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:10,color:"var(--light)"}}>
              <span style={{background:"var(--t1p)",padding:"2px 7px",borderRadius:6,fontWeight:600,color:"var(--t1d)"}}>
                {n.author==="me" ? nameMe : nameThem}
              </span>
              <span>{fmtDate(n.ts)}</span>
            </div>
            <button onClick={e=>{e.stopPropagation();setNotes(ns=>ns.filter(x=>x.id!==n.id));}}
              style={{position:"absolute",top:8,right:10,background:"none",border:"none",
                color:"var(--light)",fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ALBUM TAB（フォルダ管理・AI感想サブタイトル）
// ══════════════════════════════════════════════════════════════════════════
const AlbumTab = ({ albums, setAlbums }) => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [lightbox, setLightbox]         = useState(null);
  const [showMenu, setShowMenu]         = useState(false);
  const [editFolderName, setEditFolderName] = useState(null);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [aiLoading, setAiLoading]       = useState(null);
  const fileInputRef   = useRef(null);
  const cameraInputRef = useRef(null);

  const folder = albums.find(a => a.id === activeFolder);

  const addFolder = () => {
    const id = Date.now();
    setAlbums(a => [...a, { id, name:"新しいフォルダ", photos:[] }]);
    setTimeout(() => { setEditFolderName(id); setFolderNameInput("新しいフォルダ"); }, 50);
  };

  const renameFolder = id => {
    if (folderNameInput.trim()) setAlbums(a => a.map(f => f.id===id ? {...f,name:folderNameInput.trim()} : f));
    setEditFolderName(null);
  };

  const deleteFolder = id => {
    setAlbums(a => a.filter(f => f.id !== id));
    if (activeFolder === id) setActiveFolder(null);
  };

  const handleFiles = files => {
    if (!files||!files.length) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target.result;
        setAlbums(a => a.map(f => f.id===activeFolder
          ? { ...f, photos:[...f.photos, { id:Date.now()+Math.random(), url, subtitle:"" }] }
          : f
        ));
      };
      reader.readAsDataURL(file);
    });
    setShowMenu(false);
  };

  const removePhoto = photoId => {
    setAlbums(a => a.map(f => f.id===activeFolder
      ? { ...f, photos: f.photos.filter(p => p.id !== photoId) }
      : f
    ));
  };

  const getAiSubtitle = async photo => {
    setAiLoading(photo.id);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:200,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:"image/jpeg", data: photo.url.split(",")[1]||photo.url } },
            { type:"text",  text:"この写真から読み取れる情景・表情・食事・雰囲気などを元に、カップルの思い出として温かみのある短いサブタイトル（20文字以内）をひとつだけ返してください。" }
          ]}]
        })
      });
      const d = await res.json();
      const subtitle = d.content?.map(c=>c.text||"").join("").trim() || "";
      setAlbums(a => a.map(f => f.id===activeFolder
        ? { ...f, photos: f.photos.map(p => p.id===photo.id ? {...p,subtitle} : p) }
        : f
      ));
    } catch(e) {
      console.error(e);
    }
    setAiLoading(null);
  };

  // フォルダ一覧
  if (activeFolder === null) return (
    <div style={{padding:14,overflowY:"auto",height:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:700,color:"var(--ink)"}}>アルバム</div>
        <Btn onClick={addFolder} small>＋ フォルダ追加</Btn>
      </div>
      {albums.length === 0 && (
        <div style={{textAlign:"center",color:"var(--light)",fontSize:13,marginTop:50}}>
          <div style={{fontSize:36,marginBottom:8}}>📁</div>フォルダがありません
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {albums.map(f => (
          <div key={f.id}
            style={{background:"var(--card)",borderRadius:12,padding:"12px 14px",
              boxShadow:"0 1px 6px var(--shadow)",border:"1px solid rgba(128,128,128,.08)",
              display:"flex",alignItems:"center",gap:12,position:"relative"}}>
            {/* サムネイル */}
            <div onClick={() => setActiveFolder(f.id)} style={{
              width:56,height:56,borderRadius:10,overflow:"hidden",flexShrink:0,
              background:"var(--t1p)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {f.photos.length > 0
                ? <img src={f.photos[0].url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <span style={{fontSize:22}}>📷</span>
              }
            </div>
            {/* 名前編集 */}
            <div onClick={() => setActiveFolder(f.id)} style={{flex:1,cursor:"pointer"}}>
              {editFolderName === f.id ? (
                <input value={folderNameInput} onChange={e=>setFolderNameInput(e.target.value)}
                  onBlur={() => renameFolder(f.id)}
                  onKeyDown={e => e.key==="Enter" && renameFolder(f.id)}
                  onClick={e => e.stopPropagation()}
                  autoFocus
                  style={{fontFamily:"var(--font)",fontSize:14,fontWeight:700,border:"none",
                    borderBottom:"2px solid var(--t1)",background:"none",color:"var(--ink)",width:"100%"}}/>
              ) : (
                <div style={{fontSize:14,fontWeight:700,color:"var(--ink)"}}>{f.name}</div>
              )}
              <div style={{fontSize:11,color:"var(--mid)",marginTop:2}}>{f.photos.length}枚</div>
            </div>
            <button onClick={e=>{e.stopPropagation();setEditFolderName(f.id);setFolderNameInput(f.name);}}
              style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"var(--mid)"}}>✏️</button>
            <button onClick={e=>{e.stopPropagation();deleteFolder(f.id);}}
              style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:"var(--light)"}}>×</button>
          </div>
        ))}
      </div>
    </div>
  );

  // フォルダ内
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
        <Btn onClick={() => setActiveFolder(null)} variant="ghost" small>← 戻る</Btn>
        <span style={{flex:1,fontSize:14,fontWeight:700,color:"var(--ink)"}}>{folder?.name}</span>
        <div style={{position:"relative"}}>
          <Btn onClick={() => setShowMenu(m=>!m)} small>＋ 追加</Btn>
          {showMenu && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:50,
              background:"var(--card)",borderRadius:12,boxShadow:"0 4px 20px var(--shadow)",
              border:"1px solid var(--hborder)",overflow:"hidden",minWidth:160,animation:"fadeIn .15s"}}>
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",
                fontSize:13,fontWeight:600,color:"var(--ink)",borderBottom:"1px solid var(--hborder)"}}>
                <span>📷 カメラ</span>
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
                  style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",
                fontSize:13,fontWeight:600,color:"var(--ink)"}}>
                <span>🖼 フォルダから</span>
                <input ref={fileInputRef} type="file" accept="image/*" multiple
                  style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
              </label>
            </div>
          )}
        </div>
      </div>
      {showMenu && <div onClick={()=>setShowMenu(false)} style={{position:"fixed",inset:0,zIndex:49}}/>}
      <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
        {(!folder||folder.photos.length===0) && (
          <div style={{textAlign:"center",color:"var(--light)",fontSize:13,marginTop:50,padding:"20px"}}>
            <div style={{fontSize:40,marginBottom:8}}>📷</div>
            写真を追加してね
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
          {folder?.photos.map(photo => (
            <div key={photo.id} style={{position:"relative",animation:"fadeIn .3s"}}>
              <div style={{aspectRatio:"1",overflow:"hidden",borderRadius:8}}>
                <img src={photo.url} alt="" onClick={()=>setLightbox(photo)}
                  style={{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer",display:"block"}}/>
              </div>
              {photo.subtitle && (
                <div style={{fontSize:9,color:"var(--mid)",padding:"2px 3px",lineHeight:1.3,
                  textAlign:"center",background:"rgba(255,255,255,.85)",
                  borderRadius:"0 0 8px 8px",marginTop:-2}}>{photo.subtitle}</div>
              )}
              {!photo.subtitle && (
                <button onClick={() => getAiSubtitle(photo)}
                  style={{position:"absolute",bottom:3,left:3,background:"rgba(0,0,0,.45)",
                    border:"none",borderRadius:6,color:"white",fontSize:9,padding:"2px 5px",
                    cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>
                  {aiLoading===photo.id ? "…" : "✨AI"}
                </button>
              )}
              <button onClick={() => removePhoto(photo.id)}
                style={{position:"absolute",top:3,right:3,width:20,height:20,borderRadius:10,
                  background:"rgba(0,0,0,.4)",border:"none",color:"white",
                  fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
          ))}
        </div>
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          zIndex:200,animation:"fadeIn .2s",gap:10}}>
          <img src={lightbox.url} alt="" style={{maxWidth:"94vw",maxHeight:"78vh",borderRadius:12}}/>
          {lightbox.subtitle && (
            <div style={{color:"rgba(255,255,255,.85)",fontSize:13,fontWeight:500}}>{lightbox.subtitle}</div>
          )}
          <div onClick={()=>setLightbox(null)} style={{position:"absolute",top:18,right:18,
            width:32,height:32,borderRadius:16,background:"rgba(255,255,255,.15)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"white",fontWeight:700,fontSize:18,cursor:"pointer"}}>×</div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PROFILE TAB（設定でフィールド管理）
// ══════════════════════════════════════════════════════════════════════════
const ProfileTab = ({ profiles, setProfiles, profFields }) => {
  const [viewing, setViewing] = useState("me");
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState(null);
  const p = profiles[viewing];
  const activeFields = profFields.filter(f => f.active !== false);

  if (editing && form) return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",animation:"fadeIn .2s"}}>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
        <Btn onClick={() => setEditing(false)} variant="ghost" small>← 戻る</Btn>
        <span style={{flex:1,fontSize:14,fontWeight:700,color:"var(--ink)"}}>
          {viewing==="me"?"自分":"相手"}のプロフィール
        </span>
        <Btn onClick={() => { setProfiles(prev=>({...prev,[viewing]:form})); setEditing(false); }} small>保存</Btn>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
        {/* アイコン */}
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
          <div style={{width:52,height:52,borderRadius:26,
            background:viewing==="me"?"linear-gradient(135deg,#5bc8d4,#2d9aa8)":"linear-gradient(135deg,#c0524a,#9a3830)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
            {form.emoji || (viewing==="me"?"🌊":"🌺")}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"var(--mid)",marginBottom:5,fontWeight:600}}>アイコン</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {["🌊","🌺","🐾","🤖","🌸","🦊","🐻","🐰","🌟","💫","🎀","🎸","🌙","🍀"].map(e => (
                <button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))}
                  style={{width:28,height:28,borderRadius:8,
                    border:form.emoji===e?"2px solid var(--t1)":"1px solid var(--light)",
                    background:form.emoji===e?"var(--t1p)":"var(--card)",cursor:"pointer",fontSize:14}}>{e}</button>
              ))}
            </div>
          </div>
        </div>
        {activeFields.map(field => (
          <div key={field.key} style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--mid)",marginBottom:4}}>{field.icon} {field.label}</div>
            {field.multi
              ? <textarea value={form[field.key]||""} onChange={e=>setForm(f=>({...f,[field.key]:e.target.value}))}
                  placeholder={`${field.label}を入力…`} rows={3}
                  style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:10,padding:"8px 11px",
                    fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)",resize:"none",lineHeight:1.7}}/>
              : <input value={form[field.key]||""} onChange={e=>setForm(f=>({...f,[field.key]:e.target.value}))}
                  placeholder={`${field.label}を入力…`}
                  style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:10,padding:"8px 11px",
                    fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)"}}/>
            }
          </div>
        ))}
      </div>
    </div>
  );

  const isMizu = viewing === "me";
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 12px 0",flexShrink:0}}>
        <div style={{display:"flex",background:"rgba(128,128,128,.08)",borderRadius:12,padding:3,gap:3}}>
          {["me","them"].map(who => (
            <button key={who} onClick={() => setViewing(who)}
              style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontFamily:"var(--font)",
                fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s",
                background: viewing===who?(who==="me"?"linear-gradient(135deg,#5bc8d4,#2d9aa8)":"linear-gradient(135deg,#c0524a,#9a3830)"):"transparent",
                color: viewing===who?"white":"var(--mid)"}}>
              {profiles[who].emoji||(who==="me"?"🌊":"🌺")} {profiles[who].name || (who==="me"?"自分":"相手")}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
        <div style={{background:"var(--card)",borderRadius:16,padding:"16px",marginBottom:12,
          textAlign:"center",border:"1px solid rgba(128,128,128,.08)",position:"relative",
          boxShadow:"0 1px 8px var(--shadow)"}}>
          <div style={{width:60,height:60,borderRadius:30,
            background:isMizu?"linear-gradient(135deg,#5bc8d4,#2d9aa8)":"linear-gradient(135deg,#c0524a,#9a3830)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 8px"}}>
            {p.emoji||(isMizu?"🌊":"🌺")}
          </div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:2,color:"var(--ink)"}}>{p.name||"（未設定）"}</div>
          {p.nickname && <div style={{fontSize:12,color:"var(--mid)"}>「{p.nickname}」</div>}
          {(p.birthday||p.birthplace) && (
            <div style={{fontSize:11,color:"var(--mid)",marginTop:5,display:"flex",justifyContent:"center",gap:10}}>
              {p.birthday&&<span>🎂 {p.birthday}</span>}
              {p.birthplace&&<span>📍 {p.birthplace}</span>}
            </div>
          )}
          {p.job && <div style={{fontSize:11,color:"var(--mid)",marginTop:3}}>💼 {p.job}</div>}
          <button onClick={() => { setForm({...p}); setEditing(true); }}
            style={{position:"absolute",top:10,right:10,background:"var(--t1p)",
              border:"1px solid var(--hborder)",borderRadius:8,padding:"4px 10px",
              fontSize:11,cursor:"pointer",fontWeight:600,color:"var(--t1d)"}}>✏️ 編集</button>
        </div>
        {activeFields.filter(f=>f.key!=="name"&&f.key!=="nickname"&&f.key!=="birthday"&&f.key!=="birthplace"&&f.key!=="job").map(f => p[f.key] && (
          <div key={f.key} style={{background:"var(--card)",borderRadius:12,padding:"12px 14px",
            marginBottom:8,boxShadow:"0 1px 6px var(--shadow)",border:"1px solid rgba(128,128,128,.06)"}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--mid)",marginBottom:4}}>{f.icon} {f.label}</div>
            <div style={{fontSize:13,lineHeight:1.7,whiteSpace:"pre-line",color:"var(--ink)",fontWeight:500}}>{p[f.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// KIROKU TAB
// ══════════════════════════════════════════════════════════════════════════
const KIROKU_CATS = [
  { id:"rule",  label:"決め事", icon:"📜", color:"#5bc8d4" },
  { id:"quote", label:"語録",   icon:"💬", color:"#c0524a" },
  { id:"other", label:"その他", icon:"✨", color:"#bf8a5e" },
];
const KirokuTab = ({ kiroku, setKiroku, profiles }) => {
  const [activeCat, setActiveCat] = useState("all");
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState({ cat:"rule", title:"", body:"", author:"me" });
  const nameMe   = profiles.me.name   || "自分";
  const nameThem = profiles.them.name || "相手";
  const filtered = activeCat==="all" ? kiroku : kiroku.filter(k=>k.cat===activeCat);
  const catOf    = id => KIROKU_CATS.find(c=>c.id===id) || KIROKU_CATS[2];

  if (editing !== null) return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",animation:"fadeIn .2s"}}>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
        <Btn onClick={() => setEditing(null)} variant="ghost" small>← 戻る</Btn>
        <span style={{flex:1,fontSize:14,fontWeight:700}}>{editing==="new"?"新しく記録":"記録を編集"}</span>
        <Btn onClick={() => {
          if (!form.title.trim()&&!form.body.trim()) { setEditing(null); return; }
          if (editing==="new") setKiroku(k=>[...k,{id:Date.now(),...form,ts:Date.now()}]);
          else setKiroku(k=>k.map(x=>x.id===editing?{...x,...form,ts:Date.now()}:x));
          setEditing(null);
        }} small>保存</Btn>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:"var(--mid)",marginBottom:6,fontWeight:600}}>カテゴリ</div>
          <div style={{display:"flex",gap:6}}>
            {KIROKU_CATS.map(cat=>(
              <button key={cat.id} onClick={()=>setForm(f=>({...f,cat:cat.id}))}
                style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",fontFamily:"var(--font)",
                  border:form.cat===cat.id?`2px solid ${cat.color}`:"1px solid rgba(128,128,128,.18)",
                  background:form.cat===cat.id?`${cat.color}18`:"transparent",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:18}}>{cat.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:"var(--ink)"}}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,color:"var(--mid)",marginBottom:5,fontWeight:600}}>記録者</div>
          <div style={{display:"flex",gap:6}}>
            {[["me",nameMe],["them",nameThem]].map(([who,label])=>(
              <button key={who} onClick={()=>setForm(f=>({...f,author:who}))}
                style={{flex:1,padding:"7px",borderRadius:10,cursor:"pointer",fontFamily:"var(--font)",
                  border:form.author===who?"2px solid var(--t1)":"1px solid rgba(128,128,128,.18)",
                  background:form.author===who?"var(--t1p)":"transparent",
                  fontSize:13,fontWeight:600,color:form.author===who?"var(--t1d)":"var(--mid)"}}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,color:"var(--mid)",marginBottom:4,fontWeight:600}}>タイトル</div>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="タイトル"
            style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:10,padding:"8px 11px",
              fontFamily:"var(--font)",fontSize:14,fontWeight:700,background:"var(--t1p)",color:"var(--ink)"}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"var(--mid)",marginBottom:4,fontWeight:600}}>内容</div>
          <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} rows={5}
            placeholder="内容を書いてね…"
            style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:10,padding:"8px 11px",
              fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)",
              resize:"none",lineHeight:1.8}}/>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 12px 0",flexShrink:0}}>
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4}}>
          {[{id:"all",label:"すべて",icon:"📋",color:"var(--t1)"},...KIROKU_CATS].map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCat(cat.id)}
              style={{flexShrink:0,padding:"5px 11px",borderRadius:18,cursor:"pointer",
                fontFamily:"var(--font)",border:activeCat===cat.id?`2px solid ${cat.color}`:"1px solid rgba(128,128,128,.18)",
                background:activeCat===cat.id?`${cat.color}18`:"transparent",
                fontSize:12,fontWeight:600,color:"var(--ink)",display:"flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
          <Btn onClick={()=>{setEditing("new");setForm({cat:"rule",title:"",body:"",author:"me"});}} small>＋ 記録</Btn>
        </div>
        {filtered.length===0 && (
          <div style={{textAlign:"center",color:"var(--light)",fontSize:13,marginTop:40}}>
            <div style={{fontSize:32,marginBottom:8}}>📋</div>まだ記録がありません
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map(item=>{
            const cat=catOf(item.cat);
            return(
              <div key={item.id} onClick={()=>{setEditing(item.id);setForm({cat:item.cat,title:item.title,body:item.body,author:item.author});}}
                style={{background:"var(--card)",borderRadius:12,padding:"12px 14px",
                  boxShadow:"0 1px 6px var(--shadow)",cursor:"pointer",
                  border:`1px solid ${cat.color}28`,animation:"fadeUp .25s ease",position:"relative"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <span style={{background:`${cat.color}18`,color:cat.color,border:`1px solid ${cat.color}44`,
                    borderRadius:7,padding:"1px 7px",fontSize:10,fontWeight:700}}>{cat.icon} {cat.label}</span>
                  <span style={{fontSize:10,color:"var(--light)",marginLeft:"auto"}}>
                    {item.author==="me"?nameMe:nameThem}
                  </span>
                </div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4,color:"var(--ink)"}}>{item.title||"無題"}</div>
                <div style={{fontSize:12,color:"var(--mid)",lineHeight:1.6}}>
                  {item.body.slice(0,55)}{item.body.length>55?"…":""}
                </div>
                <div style={{fontSize:10,color:"var(--light)",marginTop:6,textAlign:"right"}}>{fmtDate(item.ts)}</div>
                <button onClick={e=>{e.stopPropagation();setKiroku(k=>k.filter(x=>x.id!==item.id));}}
                  style={{position:"absolute",top:8,right:10,background:"none",border:"none",
                    color:"var(--light)",fontSize:15,cursor:"pointer"}}>×</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// DATE PLAN AI TAB
// ══════════════════════════════════════════════════════════════════════════
const DATE_CATS = [
  {id:"drinks",label:"飲み歩き",icon:"🍺",color:"#b8860b"},
  {id:"food",  label:"食べ歩き",icon:"🍜",color:"#a0693a"},
  {id:"walk",  label:"お散歩",  icon:"🌸",color:"#5c8a6e"},
  {id:"drive", label:"ドライブ",icon:"🚗",color:"#5c6bc0"},
  {id:"indoor",label:"インドア",icon:"🏠",color:"#7b5ea7"},
  {id:"free",  label:"フリー",  icon:"✨",color:"#a05060"},
];
const PRESET = {
  drinks:[{name:"渋谷ナイトバー巡り",area:"東京・渋谷",shops:[
    {n:"BAR MUSIC",desc:"こだわりカクテルの隠れ家バー",img:"https://images.unsplash.com/photo-1543007631-283050bb3e8c?w=400&q=80",link:"https://www.google.com/maps/search/渋谷+バー"},
    {n:"The SG Club",desc:"世界Top50バーテンダーの本格バー",img:"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",link:"https://www.google.com/maps/search/渋谷+カクテル"},
  ],comment:"渋谷のネオンを背景に、2人でグラスを傾ける夜。お酒と音楽が2人の距離を縮めてくれた。"}],
  food:[{name:"浅草・仲見世食べ歩き",area:"東京・浅草",shops:[
    {n:"亀十",desc:"ふわふわどら焼きの名店",img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",link:"https://www.google.com/maps/search/浅草+亀十"},
    {n:"舟和",desc:"芋ようかんのお土産処",img:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",link:"https://www.google.com/maps/search/浅草+舟和"},
  ],comment:"提灯の灯る仲見世を歩きながら、気になるものを指差して笑い合う。下町の空気が2人を包んでいた。"}],
  walk:[{name:"目黒川沿いさんぽ",area:"東京・中目黒",shops:[
    {n:"目黒川沿い",desc:"四季折々の自然が楽しめる川沿い遊歩道",img:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80",link:"https://www.google.com/maps/search/目黒川"},
    {n:"蔦屋書店 代官山",desc:"2人でお気に入りの本を選ぶ午後",img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",link:"https://www.google.com/maps/search/代官山+蔦屋書店"},
  ],comment:"川のせせらぎを聞きながら、2人で並んで歩いた。歩調が自然と合う瞬間が嬉しかった。"}],
  drive:[{name:"湘南ドライブ",area:"神奈川・湘南",shops:[
    {n:"江の島",desc:"展望台からの絶景と新鮮な海の幸",img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",link:"https://www.google.com/maps/search/江の島"},
    {n:"鵠沼海岸",desc:"サーファーが集まるおしゃれビーチ",img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",link:"https://www.google.com/maps/search/鵠沼海岸"},
  ],comment:"窓を開けて潮の香りを感じながら走る。君の横顔が夕焼けに染まって、綺麗だなと思った。"}],
  indoor:[{name:"チームラボ＆恵比寿",area:"東京・恵比寿",shops:[
    {n:"teamLab Borderless",desc:"光と映像の幻想的な体験型アート",img:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&q=80",link:"https://www.google.com/maps/search/チームラボ"},
    {n:"恵比寿カフェ",desc:"ゆっくり話せるスペシャルティコーヒー",img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",link:"https://www.google.com/maps/search/恵比寿+カフェ"},
  ],comment:"光の海の中で2人で黙って並んでいた。言葉がなくても同じ気持ちでいるとわかる瞬間があった。"}],
};

// ── 中央ポップアップモーダル
const CenterModal = ({ onClose, title, children }) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",
    display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,animation:"fadeIn .2s",padding:"16px"}}>
    <div style={{background:"var(--card)",borderRadius:20,width:"100%",maxWidth:420,
      maxHeight:"85vh",overflowY:"auto",animation:"modalIn .25s ease",
      boxShadow:"0 8px 40px rgba(0,0,0,.3)",border:"1px solid rgba(255,255,255,.3)"}}>
      <div style={{padding:"16px 18px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",
        borderBottom:"1px solid var(--hborder)",position:"sticky",top:0,background:"var(--card)",zIndex:2}}>
        <div style={{fontSize:15,fontWeight:700,color:"var(--ink)"}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",
          color:"var(--mid)",lineHeight:1,padding:"0 4px"}}>×</button>
      </div>
      <div style={{padding:"16px 18px 24px"}}>{children}</div>
    </div>
  </div>
);

// ── 待ち合わせナビ
const MeetNavContent = () => {
  const [from,setFrom]=useState("");const [to,setTo]=useState("");
  const [loading,setLoading]=useState(false);const [result,setResult]=useState(null);
  const search = async () => {
    if (!to.trim()) return; setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:
          `「${from||"現在地"}」から「${to}」への公共交通機関ルートをJSON形式で：{"route":"経路（路線名・乗換駅明記・改行あり）","time":"所要時間","fare":"運賃目安","walkMin":"最寄り駅から徒歩分数","meetTip":"待ち合わせのコツ"} JSONのみ。`}]})});
      const d = await res.json();
      setResult(JSON.parse(d.content?.map(c=>c.text||"").join("").trim().replace(/```json|```/g,"")));
    } catch(e) { setResult({route:"Google Mapsでご確認ください",time:"--",fare:"--",walkMin:"--",meetTip:"改札前が定番です"}); }
    setLoading(false);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600,marginBottom:-4}}>🚉 出発地（住所・駅名どちらでも可）</div>
      <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="例：東京都渋谷区○○、渋谷駅、現在地…"
        style={{border:"1px solid var(--hborder)",borderRadius:10,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)"}}/>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600,marginBottom:-4}}>📍 待ち合わせ場所</div>
      <input value={to} onChange={e=>setTo(e.target.value)} placeholder="例：原宿駅、六本木ヒルズ…"
        style={{border:"1px solid var(--hborder)",borderRadius:10,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)"}}/>
      <Btn onClick={search} style={{opacity:to.trim()?1:.5}}>🔍 ルートを調べる</Btn>
      {loading && <div style={{textAlign:"center",padding:"16px 0"}}><div style={{width:30,height:30,borderRadius:15,border:"3px solid var(--t1p)",borderTopColor:"var(--t1)",animation:"spin 1s linear infinite",margin:"0 auto 8px"}}/><div style={{fontSize:12,color:"var(--mid)"}}>調べています…</div></div>}
      {result && !loading && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:"var(--t1p)",borderRadius:12,padding:"12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--t1d)",marginBottom:6}}>🚃 ルート</div>
            <div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-line",color:"var(--ink)"}}>{result.route}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[["⏱ 所要時間",result.time],["💰 運賃目安",result.fare],["🚶 徒歩",result.walkMin]].map(([lb,vl])=>(
              <div key={lb} style={{flex:1,background:"var(--card)",borderRadius:10,padding:"8px",textAlign:"center",border:"1px solid var(--hborder)"}}>
                <div style={{fontSize:9,color:"var(--mid)",fontWeight:600}}>{lb}</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--t1d)",marginTop:2}}>{vl}</div>
              </div>
            ))}
          </div>
          {result.meetTip && <div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:12,padding:"10px 12px",fontSize:12,lineHeight:1.7,color:"var(--ink)"}}>💕 {result.meetTip}</div>}
          <a href={`https://www.google.com/maps/dir/${encodeURIComponent(from||"現在地")}/${encodeURIComponent(to)}`}
            target="_blank" rel="noopener noreferrer"
            style={{display:"block",textAlign:"center",background:"var(--btnnav)",color:"white",textDecoration:"none",borderRadius:10,padding:"10px",fontSize:13,fontWeight:700}}>
            📱 Google Mapsで開く
          </a>
        </div>
      )}
    </div>
  );
};

// ── 終電逆算
const LastTrainContent = () => {
  const [from,setFrom]=useState("");const [to,setTo]=useState("");
  const [loading,setLoading]=useState(false);const [result,setResult]=useState(null);
  const nowStr = new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
  const search = async () => {
    if (!from.trim()||!to.trim()) return; setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,messages:[{role:"user",content:
          `現在時刻${nowStr}。「${from}」から「${to}」への終電。JSON：{"lastTrainTime":"終電時刻","arrivalTime":"到着時刻","transfers":"乗換情報","leaveBy10":"徒歩10分想定の出発時刻","leaveBy15":"徒歩15分想定","minutesLeft":"残り分数","missedAction":"乗り遅れ対応","loveComment":"2人への一言"} JSONのみ。`}]})});
      const d = await res.json();
      setResult(JSON.parse(d.content?.map(c=>c.text||"").join("").trim().replace(/```json|```/g,"")));
    } catch(e) { setResult({lastTrainTime:"23:30頃",arrivalTime:"0:30頃",transfers:"各路線をご確認ください",leaveBy10:"23:15までに",leaveBy15:"23:10までに",minutesLeft:"--",missedAction:"GOやDiDiが便利です🚕",loveComment:"終電を気にしながらも、もう少しだけ一緒にいたいよね"}); }
    setLoading(false);
  };
  const mins = result?.minutesLeft;
  const urgent = mins && parseInt(mins) < 30 ? "#e06820" : "var(--t1d)";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600}}>現在時刻：{nowStr}</div>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600,marginBottom:-4}}>🚉 いまいる駅・住所</div>
      <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="例：渋谷、東京都渋谷区○○…"
        style={{border:"1px solid var(--hborder)",borderRadius:10,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,background:"var(--t2p)",color:"var(--ink)"}}/>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600,marginBottom:-4}}>🏠 帰る駅・目的地</div>
      <input value={to} onChange={e=>setTo(e.target.value)} placeholder="例：横浜、吉祥寺…"
        style={{border:"1px solid var(--hborder)",borderRadius:10,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,background:"var(--t2p)",color:"var(--ink)"}}/>
      <Btn onClick={search} variant="secondary" style={{opacity:(from.trim()&&to.trim())?1:.5}}>🔍 終電を逆算する</Btn>
      {loading && <div style={{textAlign:"center",padding:"16px 0"}}><div style={{width:30,height:30,borderRadius:15,border:"3px solid var(--t2p)",borderTopColor:"var(--t2)",animation:"spin 1s linear infinite",margin:"0 auto 8px"}}/><div style={{fontSize:12,color:"var(--mid)"}}>調べています…</div></div>}
      {result && !loading && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:"var(--t2p)",borderRadius:12,padding:"12px"}}>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              {[["終電",result.lastTrainTime],["到着",result.arrivalTime],["残り",result.minutesLeft+"分"]].map(([lb,vl])=>(
                <div key={lb} style={{flex:1,background:"rgba(255,255,255,.6)",borderRadius:10,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"var(--mid)",fontWeight:600}}>{lb}</div>
                  <div style={{fontSize:16,fontWeight:700,color:lb==="残り"?urgent:"var(--t2d)",marginTop:2}}>{vl}</div>
                </div>
              ))}
            </div>
            {result.transfers && <div style={{fontSize:12,lineHeight:1.7,color:"var(--ink)"}}>{result.transfers}</div>}
          </div>
          <div style={{background:"var(--card)",borderRadius:12,padding:"11px",border:"1px solid var(--hborder)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:6}}>⏰ 出発の目安（逆算）</div>
            <div style={{display:"flex",gap:8}}>
              {[["🚶 徒歩10分",result.leaveBy10],["🚶 徒歩15分",result.leaveBy15]].map(([lb,vl])=>(
                <div key={lb} style={{flex:1,background:"var(--t1p)",borderRadius:10,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"var(--t1d)",fontWeight:600}}>{lb}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--t1d)",marginTop:2}}>{vl}</div>
                </div>
              ))}
            </div>
          </div>
          {result.missedAction && <div style={{background:"var(--card)",borderRadius:10,padding:"10px 12px",fontSize:12,lineHeight:1.7,color:"var(--ink)",border:"1px solid var(--hborder)"}}>🚕 {result.missedAction}</div>}
          {result.loveComment && <div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:12,padding:"10px 12px",fontSize:12,lineHeight:1.7,fontStyle:"italic",color:"var(--ink)"}}>💕 {result.loveComment}</div>}
          <div style={{display:"flex",gap:8}}>
            <a href={`https://transit.yahoo.co.jp/search/result?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&type=4`}
              target="_blank" rel="noopener noreferrer"
              style={{flex:1,display:"block",textAlign:"center",background:"var(--btnme)",color:"white",textDecoration:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:700}}>Yahoo!乗換</a>
            <a href={`https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`}
              target="_blank" rel="noopener noreferrer"
              style={{flex:1,display:"block",textAlign:"center",background:"var(--btnnav)",color:"white",textDecoration:"none",borderRadius:10,padding:"9px",fontSize:12,fontWeight:700}}>Google Maps</a>
          </div>
        </div>
      )}
    </div>
  );
};

const DatePlanTab = ({ profiles }) => {
  const [step,setStep]         = useState("category");
  const [category,setCategory] = useState(null);
  const [freeText,setFreeText] = useState("");
  const [area,setArea]         = useState("");
  const [loading,setLoading]   = useState(false);
  const [plan,setPlan]         = useState(null);
  const [aiComment,setAiComment] = useState("");
  const [showMeet,setShowMeet] = useState(false);
  const [showTrain,setShowTrain] = useState(false);
  const pMe=profiles.me; const pThem=profiles.them;

  const gen = async () => {
    setLoading(true); setStep("result");
    let base = category!=="free" ? (PRESET[category]||[])[0] : null;
    try {
      const aHint = area.trim() ? `エリア：${area}` : "";
      const prompt = category==="free"
        ? `${pMe.name||"水谷"}と${pThem.name||"茜"}のデートプラン。テーマ：「${freeText}」。${aHint}。JSON：{"planName":"...","area":"...","shops":[{"n":"...","desc":"...","img":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","link":"https://www.google.com/maps/search/..."}],"comment":"..."} JSONのみ。`
        : `${pMe.name||"水谷"}と${pThem.name||"茜"}の「${DATE_CATS.find(c=>c.id===category)?.label}」デート。${aHint}。プラン：${base?.name}。2人になりきった一人称コメント150文字のみ。`;
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const d = await res.json();
      const text = d.content?.map(c=>c.text||"").join("").trim()||"";
      if (category==="free") {
        try { const p=JSON.parse(text.replace(/```json|```/g,"").trim()); setPlan(p); setAiComment(p.comment||""); }
        catch { setPlan({planName:"カスタムプラン",area:area||"東京",shops:[],comment:text}); setAiComment(text); }
      } else { setPlan(base); setAiComment(text||base?.comment||""); }
    } catch(e) { setPlan(base); setAiComment(base?.comment||""); }
    setLoading(false);
  };

  const NavBtns = () => (
    <div style={{display:"flex",gap:8}}>
      <button onClick={()=>setShowMeet(true)}
        style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid var(--hborder)",
          background:"var(--t1p)",cursor:"pointer",fontFamily:"var(--font)",fontSize:12,fontWeight:700,color:"var(--t1d)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
        <span>🗺️</span>いっしょに行こ
      </button>
      <button onClick={()=>setShowTrain(true)}
        style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid var(--hborder)",
          background:"var(--t2p)",cursor:"pointer",fontFamily:"var(--font)",fontSize:12,fontWeight:700,color:"var(--t2d)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
        <span>🌙</span>終電だいじょぶ？
      </button>
    </div>
  );

  const AreaInput = () => (
    <div style={{background:"var(--card)",borderRadius:12,padding:"11px 13px",border:"1px solid var(--hborder)",marginBottom:10}}>
      <div style={{fontSize:11,color:"var(--mid)",fontWeight:600,marginBottom:5}}>📍 エリア・方面（任意）</div>
      <input value={area} onChange={e=>setArea(e.target.value)} placeholder="例：渋谷、鎌倉、大阪…"
        style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:8,padding:"7px 11px",
          fontFamily:"var(--font)",fontSize:13,background:"var(--t1p)",color:"var(--ink)"}}/>
    </div>
  );

  if (step==="category") return (
    <div style={{padding:14,overflowY:"auto",height:"100%"}}>
      <div style={{fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:2}}>デートプラン AI</div>
      <div style={{fontSize:12,color:"var(--mid)",marginBottom:12}}>どんなデートがしたい？</div>
      <AreaInput/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {DATE_CATS.map(cat=>(
          <button key={cat.id} onClick={()=>{setCategory(cat.id);setStep(cat.id==="free"?"input":"confirm");}}
            style={{padding:"13px 8px",borderRadius:12,border:`1px solid ${cat.color}44`,
              background:`${cat.color}12`,cursor:"pointer",fontFamily:"var(--font)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${cat.color}22`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${cat.color}12`;}}>
            <span style={{fontSize:22}}>{cat.icon}</span>
            <span style={{fontSize:12,fontWeight:700,color:"var(--ink)"}}>{cat.label}</span>
          </button>
        ))}
      </div>
      <NavBtns/>
      {showMeet && <CenterModal onClose={()=>setShowMeet(false)} title="🗺️ いっしょに行こ！"><MeetNavContent/></CenterModal>}
      {showTrain && <CenterModal onClose={()=>setShowTrain(false)} title="🌙 終電だいじょぶ？"><LastTrainContent/></CenterModal>}
    </div>
  );

  if (step==="input") return (
    <div style={{padding:14,display:"flex",flexDirection:"column",height:"100%",gap:10}}>
      <Btn onClick={()=>setStep("category")} variant="ghost" small style={{alignSelf:"flex-start"}}>← 戻る</Btn>
      <div style={{fontSize:15,fontWeight:700,color:"var(--ink)"}}>✨ フリー入力</div>
      <AreaInput/>
      <textarea value={freeText} onChange={e=>setFreeText(e.target.value)}
        placeholder="どんなデートがしたいか自由に書いてね…" rows={4}
        style={{border:"1px solid var(--hborder)",borderRadius:12,padding:"11px",fontFamily:"var(--font)",
          fontSize:13,lineHeight:1.7,resize:"none",background:"var(--t1p)",color:"var(--ink)"}}/>
      <Btn onClick={()=>{if(freeText.trim())gen();}} style={{opacity:freeText.trim()?1:.5}}>💕 プランを提案してもらう</Btn>
    </div>
  );

  if (step==="confirm") return (
    <div style={{padding:14,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}>
      <Btn onClick={()=>setStep("category")} variant="ghost" small style={{alignSelf:"flex-start"}}>← 戻る</Btn>
      <AreaInput/>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:6}}>{DATE_CATS.find(c=>c.id===category)?.icon}</div>
        <div style={{fontSize:15,fontWeight:700,color:"var(--ink)"}}>{DATE_CATS.find(c=>c.id===category)?.label}プランを提案</div>
      </div>
      <Btn onClick={gen}>💕 プランを提案してもらう</Btn>
    </div>
  );

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,
        borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
        <Btn onClick={()=>{setStep("category");setPlan(null);setAiComment("");}} variant="ghost" small>← 戻る</Btn>
        <span style={{fontSize:14,fontWeight:700,color:"var(--ink)"}}>デートプラン</span>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {loading ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:12}}>
            <div style={{width:40,height:40,borderRadius:20,border:"3px solid var(--t1p)",borderTopColor:"var(--t1)",animation:"spin 1s linear infinite"}}/>
            <div style={{fontSize:13,color:"var(--mid)",animation:"pulse 1.5s infinite"}}>プランを考えています…</div>
          </div>
        ) : (
          <div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
            {plan && (<>
              <div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:14,padding:"12px",border:"1px solid var(--hborder)"}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:2,color:"var(--ink)"}}>{plan.planName||plan.name}</div>
                <div style={{fontSize:11,color:"var(--mid)"}}>📍 {plan.area}</div>
              </div>
              {(plan.shops||[]).map((shop,i)=>(
                <div key={i} style={{background:"var(--card)",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px var(--shadow)"}}>
                  {shop.img&&<img src={shop.img} alt="" style={{width:"100%",height:120,objectFit:"cover"}}/>}
                  <div style={{padding:"10px 12px"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:3,color:"var(--ink)"}}>{shop.n}</div>
                    <div style={{fontSize:12,color:"var(--mid)",lineHeight:1.6,marginBottom:8}}>{shop.desc}</div>
                    <a href={shop.link} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--btnnav)",
                        color:"white",textDecoration:"none",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700}}>
                      📍 地図で見る
                    </a>
                  </div>
                </div>
              ))}
              {aiComment && (
                <div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:14,padding:"13px",border:"1px dashed rgba(128,128,128,.2)"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:5}}>
                    💬 {pMe.name||"水谷"} & {pThem.name||"茜"} より
                  </div>
                  <div style={{fontSize:13,lineHeight:1.8,fontStyle:"italic",color:"var(--ink)"}}>「{aiComment}」</div>
                </div>
              )}
              <NavBtns/>
              <Btn onClick={()=>{setPlan(null);setAiComment("");setStep("confirm");}} variant="ghost">🔄 別のプランを見る</Btn>
            </>)}
            {showMeet && <CenterModal onClose={()=>setShowMeet(false)} title="🗺️ いっしょに行こ！"><MeetNavContent/></CenterModal>}
            {showTrain && <CenterModal onClose={()=>setShowTrain(false)} title="🌙 終電だいじょぶ？"><LastTrainContent/></CenterModal>}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SETTINGS TAB（大人っぽく・プロフフィールド管理追加）
// ══════════════════════════════════════════════════════════════════════════
const SettingsTab = ({ themeId, setThemeId, pin, setPin, profFields, setProfFields }) => {
  const [newPin,setNewPin]     = useState("");
  const [pinMsg,setPinMsg]     = useState("");
  const [section,setSection]   = useState("theme");

  const changePin = () => {
    if (newPin.length!==4||!/^\d{4}$/.test(newPin)) { setPinMsg("4桁の数字で入力してください"); return; }
    setPin(newPin); setNewPin(""); setPinMsg("PINを変更しました");
    setTimeout(() => setPinMsg(""), 3000);
  };

  const toggleField = key => setProfFields(fs => fs.map(f => f.key===key ? {...f,active:!f.active} : f));

  const SECTIONS = [
    {id:"theme",  label:"テーマ"},
    {id:"profile",label:"プロフ項目"},
    {id:"pin",    label:"PIN"},
    {id:"info",   label:"情報"},
  ];

  const Row = ({ label, children }) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"10px 0",borderBottom:"1px solid var(--hborder)"}}>
      <span style={{fontSize:13,color:"var(--mid)",fontWeight:500}}>{label}</span>
      <span style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{children}</span>
    </div>
  );

  const Card = ({ children, style={} }) => (
    <div style={{background:"var(--card)",borderRadius:14,padding:"14px 16px",
      marginBottom:12,boxShadow:"0 1px 6px var(--shadow)",border:"1px solid rgba(128,128,128,.08)",...style}}>
      {children}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* セクションタブ */}
      <div style={{padding:"10px 12px 0",flexShrink:0}}>
        <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4}}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={()=>setSection(s.id)}
              style={{flexShrink:0,padding:"6px 14px",borderRadius:18,cursor:"pointer",fontFamily:"var(--font)",
                border:section===s.id?"2px solid var(--t1)":"1px solid rgba(128,128,128,.18)",
                background:section===s.id?"var(--t1p)":"transparent",
                fontSize:12,fontWeight:600,color:section===s.id?"var(--t1d)":"var(--mid)",whiteSpace:"nowrap"}}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>

        {/* テーマ */}
        {section==="theme" && (
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:"var(--mid)",marginBottom:12,letterSpacing:.5,textTransform:"uppercase"}}>テーマ</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {Object.entries(THEMES).map(([tid,t]) => (
                <button key={tid} onClick={()=>{setThemeId(tid);applyTheme(tid);}}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,
                    border:themeId===tid?"2px solid var(--t1)":"1px solid rgba(128,128,128,.12)",
                    background:themeId===tid?"var(--t1p)":"transparent",cursor:"pointer",fontFamily:"var(--font)",
                    transition:"all .15s",textAlign:"left"}}>
                  <span style={{fontSize:18}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>{t.name}</div>
                    <div style={{display:"flex",gap:4,marginTop:3}}>
                      {[t["--t1"],t["--t2"],t["--bg"]].map((c,i) => (
                        <div key={i} style={{width:14,height:14,borderRadius:7,background:c,border:"1px solid rgba(128,128,128,.2)"}}/>
                      ))}
                    </div>
                  </div>
                  {themeId===tid && <span style={{color:"var(--t1)",fontSize:16,fontWeight:700}}>✓</span>}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* プロフ項目管理 */}
        {section==="profile" && (
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:"var(--mid)",marginBottom:4,letterSpacing:.5}}>プロフィール項目</div>
            <div style={{fontSize:11,color:"var(--light)",marginBottom:12}}>表示する項目をON/OFFできます</div>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {profFields.map(f => (
                <div key={f.key} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"9px 0",borderBottom:"1px solid var(--hborder)"}}>
                  <span style={{fontSize:15}}>{f.icon}</span>
                  <span style={{flex:1,fontSize:13,fontWeight:500,color:"var(--ink)"}}>{f.label}</span>
                  <button onClick={() => toggleField(f.key)}
                    style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
                      background:f.active!==false?"var(--t1)":"rgba(128,128,128,.2)",
                      position:"relative",transition:"background .2s"}}>
                    <div style={{width:18,height:18,borderRadius:9,background:"white",position:"absolute",
                      top:3,transition:"left .2s",left:f.active!==false?23:3,boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* PIN */}
        {section==="pin" && (
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:"var(--mid)",marginBottom:12,letterSpacing:.5}}>PIN変更</div>
            <div style={{fontSize:11,color:"var(--light)",marginBottom:12}}>新しい4桁のPINを入力してください</div>
            <input value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,"").slice(0,4))}
              placeholder="新しいPIN（4桁）" maxLength={4} type="tel"
              style={{width:"100%",border:"1px solid var(--hborder)",borderRadius:10,padding:"10px 12px",
                fontFamily:"var(--font)",fontSize:18,fontWeight:700,background:"var(--t1p)",
                color:"var(--ink)",letterSpacing:8,textAlign:"center",marginBottom:10}}/>
            {pinMsg && (
              <div style={{fontSize:12,color:pinMsg.includes("変更")?`var(--t1d)`:"#c0524a",marginBottom:10,fontWeight:600}}>
                {pinMsg.includes("変更")?"✓ ":"⚠ "}{pinMsg}
              </div>
            )}
            <Btn onClick={changePin} style={{width:"100%",textAlign:"center"}}>変更する</Btn>
          </Card>
        )}

        {/* 情報 */}
        {section==="info" && (
          <Card>
            <div style={{fontSize:12,fontWeight:700,color:"var(--mid)",marginBottom:12,letterSpacing:.5}}>アプリ情報</div>
            <Row label="アプリ名">チャホ！</Row>
            <Row label="バージョン">1.0.0</Row>
            <Row label="現在のテーマ">{THEMES[themeId]?.name}</Row>
            <div style={{marginTop:16,textAlign:"center",paddingTop:12,borderTop:"1px solid var(--hborder)"}}>
              <ChahoLogo size="sm"/>
              <div style={{fontSize:10,color:"var(--light)",marginTop:6}}>2人だけの特別な場所</div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SWIPE HOOK
// ══════════════════════════════════════════════════════════════════════════
const useSwipe = (onLeft, onRight) => {
  const sx = useRef(null);
  return {
    onTouchStart: e => { sx.current = e.touches[0].clientX; },
    onTouchEnd:   e => { if (!sx.current) return; const d = e.changedTouches[0].clientX - sx.current; if (Math.abs(d)>48) { d<0?onLeft():onRight(); } sx.current=null; },
    onMouseDown:  e => { sx.current = e.clientX; },
    onMouseUp:    e => { if (!sx.current) return; const d = e.clientX - sx.current; if (Math.abs(d)>58) { d<0?onLeft():onRight(); } sx.current=null; },
  };
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════
const TABS_ORDER = ["profile","chat","notes","kiroku","album","date","settings"];
const TABS_META  = [
  {id:"profile",  icon:"👤", label:"プロフ"},
  {id:"chat",     icon:"💬", label:"チャット"},
  {id:"notes",    icon:"📝", label:"ノート"},
  {id:"kiroku",   icon:"📋", label:"きろく"},
  {id:"album",    icon:"🖼",  label:"アルバム"},
  {id:"date",     icon:"💕", label:"デートAI"},
  {id:"settings", icon:"⚙️", label:"設定"},
];

export default function App() {
  const [unlocked,  setUnlocked]  = useState(false);
  const [tabIdx,    setTabIdx]    = useState(1);
  const [animDir,   setAnimDir]   = useState(null);
  const [messages,  setMessages]  = useState(INIT_MSGS);
  const [notes,     setNotes]     = useState(INIT_NOTES);
  const [albums,    setAlbums]    = useState(INIT_ALBUMS);
  const [profiles,  setProfiles]  = useState(INIT_PROFILES);
  const [kiroku,    setKiroku]    = useState(INIT_KIROKU);
  const [themeId,   setThemeId]   = useState("chaho");
  const [pin,       setPin]       = useState("1234");
  const [profFields,setProfFields]= useState(DEFAULT_PROF_FIELDS);

  useEffect(() => { applyTheme("chaho"); }, []);

  const goTo = useCallback(idx => {
    if (idx===tabIdx || idx<0 || idx>=TABS_ORDER.length) return;
    setAnimDir(idx>tabIdx ? "left" : "right");
    setTabIdx(idx);
    setTimeout(() => setAnimDir(null), 320);
  }, [tabIdx]);

  const swipe = useSwipe(() => goTo(tabIdx+1), () => goTo(tabIdx-1));

  if (!unlocked) return (
    <div style={{height:"100vh",overflow:"hidden"}}><LockScreen onUnlock={()=>setUnlocked(true)} pin={pin}/></div>
  );

  const renderTab = () => {
    switch (TABS_ORDER[tabIdx]) {
      case "chat":     return <ChatTab     messages={messages}    setMessages={setMessages}/>;
      case "notes":    return <NotesTab    notes={notes}          setNotes={setNotes}     profiles={profiles}/>;
      case "album":    return <AlbumTab    albums={albums}        setAlbums={setAlbums}/>;
      case "profile":  return <ProfileTab  profiles={profiles}    setProfiles={setProfiles} profFields={profFields}/>;
      case "kiroku":   return <KirokuTab   kiroku={kiroku}        setKiroku={setKiroku}   profiles={profiles}/>;
      case "date":     return <DatePlanTab profiles={profiles}/>;
      case "settings": return <SettingsTab themeId={themeId}      setThemeId={setThemeId}
                                           pin={pin}              setPin={setPin}
                                           profFields={profFields} setProfFields={setProfFields}/>;
      default:         return null;
    }
  };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",position:"relative",
      fontFamily:"var(--font)",overflow:"hidden",background:"var(--bg)"}}>
      <BgDecor/>

      {/* ── ヘッダー（ロゴ常に固定・見開き最大化） */}
      <div style={{position:"relative",zIndex:2,
        padding:"8px 14px 7px",
        background:"var(--hbg)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid var(--hborder)",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        {/* ロゴ左（常に同じ位置） */}
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          <ChahoLogo size="md"/>
        </div>
        {/* キャラ右 + ロックボタン */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{animation:"bounce 2.2s ease-in-out infinite",display:"flex"}}><PupSVG size={30}/></div>
          <div style={{animation:"bounce 2.6s ease-in-out infinite",display:"flex"}}><BotSVG size={30}/></div>
          <button onClick={() => setUnlocked(false)}
            style={{background:"var(--t2p)",border:"1px solid rgba(128,128,128,.18)",borderRadius:8,
              padding:"4px 9px",cursor:"pointer",fontSize:12,color:"var(--t2d)",fontWeight:600}}>
            🔒
          </button>
        </div>
      </div>

      {/* ── ドットインジケーター（最小化） */}
      <div style={{position:"relative",zIndex:2,background:"rgba(128,128,128,.05)",
        padding:"2px 0",display:"flex",justifyContent:"center",gap:4,flexShrink:0}}>
        {TABS_ORDER.map((_,i) => (
          <div key={i} onClick={() => goTo(i)}
            style={{width:i===tabIdx?14:4,height:4,borderRadius:2,transition:"all .3s",cursor:"pointer",
              background:i===tabIdx?"var(--dot)":"rgba(128,128,128,.2)"}}/>
        ))}
      </div>

      {/* ── コンテンツ（見開き最大化） */}
      <div {...swipe} style={{flex:1,overflow:"hidden",position:"relative",zIndex:1,userSelect:"none"}}
        onMouseDown={e => swipe.onMouseDown(e)} onMouseUp={e => swipe.onMouseUp(e)}>
        <div key={tabIdx} style={{height:"100%",
          animation: animDir ? `${animDir==="left"?"slideInR":"slideInL"} .28s ease` : "fadeIn .2s ease"}}>
          {renderTab()}
        </div>
      </div>

      {/* ── ボトムナビ（コンパクト） */}
      <div style={{position:"relative",zIndex:2,display:"flex",
        background:"var(--hbg)",backdropFilter:"blur(20px)",
        borderTop:"1px solid var(--hborder)",padding:"3px 0 8px",flexShrink:0}}>
        {TABS_META.map((t,i) => (
          <button key={t.id} onClick={() => goTo(i)}
            style={{flex:1,border:"none",background:"none",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:1,paddingTop:4}}>
            <span style={{fontSize:16,filter:tabIdx===i?"none":"grayscale(50%) opacity(50%)"}}>{t.icon}</span>
            <span style={{fontSize:8,fontWeight:tabIdx===i?700:500,letterSpacing:.2,
              color:tabIdx===i?"var(--t1d)":"var(--light)",transition:"color .2s"}}>{t.label}</span>
            {tabIdx===i && <span style={{width:12,height:2,borderRadius:1,background:"var(--dotbar)",marginTop:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
