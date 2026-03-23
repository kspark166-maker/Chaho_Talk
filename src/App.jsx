import { useState, useRef, useCallback, useEffect } from "react";

// ── Fonts
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=M+PLUS+Rounded+1c:wght@900&display=swap";
document.head.appendChild(fl);

// ══════════════════════════════════════════════════════════════════════════
// THEMES
// ══════════════════════════════════════════════════════════════════════════
const THEMES = {
  chaho: {
    name:"チャホ！", icon:"🌊",
    "--t1":"#5bc8d4","--t1d":"#3ab0bc","--t1p":"#e0f7fa",
    "--t2":"#d4534a","--t2d":"#b83c33","--t2p":"#fdecea",
    "--bg":"#f7fbfc","--card":"rgba(255,255,255,.88)",
    "--ink":"#2a2a2a","--mid":"#7a8a8a","--light":"#b8cccc","--shadow":"rgba(60,140,150,0.13)",
    "--hbg":"rgba(255,255,255,.88)","--hborder":"rgba(91,200,212,.2)",
    "--grad":"linear-gradient(150deg,#e6f8fa 0%,#f7fbfc 40%,#fdf0ee 80%,#fce8e6 100%)",
    "--btnme":"linear-gradient(135deg,#d4534a,#b83c33)",
    "--btnnav":"linear-gradient(135deg,#5bc8d4,#3ab0bc)",
    "--dot":"#5bc8d4","--dotbar":"linear-gradient(90deg,#5bc8d4,#d4534a)",
  },
  chic: {
    name:"シック", icon:"🖤",
    "--t1":"#888","--t1d":"#555","--t1p":"rgba(80,80,80,.25)",
    "--t2":"#aaa","--t2d":"#777","--t2p":"rgba(100,100,100,.2)",
    "--bg":"#111","--card":"rgba(30,30,30,.95)",
    "--ink":"#e8e8e8","--mid":"#888","--light":"#555","--shadow":"rgba(0,0,0,0.5)",
    "--hbg":"rgba(20,20,20,.96)","--hborder":"rgba(100,100,100,.3)",
    "--grad":"linear-gradient(150deg,#111 0%,#1a1a1a 50%,#161616 100%)",
    "--btnme":"linear-gradient(135deg,#555,#333)",
    "--btnnav":"linear-gradient(135deg,#666,#444)",
    "--dot":"#888","--dotbar":"linear-gradient(90deg,#888,#555)",
  },
  colorful: {
    name:"カラフル", icon:"🌈",
    "--t1":"#ff6b9d","--t1d":"#e0447a","--t1p":"#ffe0ee",
    "--t2":"#ffa500","--t2d":"#e08800","--t2p":"#fff3d0",
    "--bg":"#fff8fe","--card":"rgba(255,255,255,.92)",
    "--ink":"#2a1a2a","--mid":"#8a5a7a","--light":"#d4a0c0","--shadow":"rgba(255,107,157,0.15)",
    "--hbg":"rgba(255,255,255,.92)","--hborder":"rgba(255,107,157,.25)",
    "--grad":"linear-gradient(150deg,#ffe0f0 0%,#fff8fe 35%,#fff0d0 70%,#e8f8ff 100%)",
    "--btnme":"linear-gradient(135deg,#ff6b9d,#e0447a)",
    "--btnnav":"linear-gradient(135deg,#ffa500,#e08800)",
    "--dot":"#ff6b9d","--dotbar":"linear-gradient(90deg,#ff6b9d,#ffa500)",
  },
  fresh: {
    name:"爽やか", icon:"🍃",
    "--t1":"#00bcd4","--t1d":"#0097a7","--t1p":"#e0f7fa",
    "--t2":"#4caf50","--t2d":"#388e3c","--t2p":"#e8f5e9",
    "--bg":"#f0fffe","--card":"rgba(255,255,255,.9)",
    "--ink":"#1a3a3a","--mid":"#5a8a8a","--light":"#90c0c0","--shadow":"rgba(0,188,212,0.12)",
    "--hbg":"rgba(255,255,255,.9)","--hborder":"rgba(0,188,212,.2)",
    "--grad":"linear-gradient(150deg,#e0fffe 0%,#f0fffe 40%,#e8f5e9 80%,#f0ffe8 100%)",
    "--btnme":"linear-gradient(135deg,#4caf50,#388e3c)",
    "--btnnav":"linear-gradient(135deg,#00bcd4,#0097a7)",
    "--dot":"#00bcd4","--dotbar":"linear-gradient(90deg,#00bcd4,#4caf50)",
  },
  warm: {
    name:"暖かい", icon:"🍊",
    "--t1":"#ff8c42","--t1d":"#e06820","--t1p":"#fff0e0",
    "--t2":"#e91e8c","--t2d":"#c0006a","--t2p":"#fce4f0",
    "--bg":"#fffaf5","--card":"rgba(255,255,255,.92)",
    "--ink":"#3a1a0a","--mid":"#8a5a3a","--light":"#d4a080","--shadow":"rgba(255,140,66,0.15)",
    "--hbg":"rgba(255,255,255,.92)","--hborder":"rgba(255,140,66,.22)",
    "--grad":"linear-gradient(150deg,#fff0e0 0%,#fffaf5 40%,#fce4f0 80%,#fff8e0 100%)",
    "--btnme":"linear-gradient(135deg,#e91e8c,#c0006a)",
    "--btnnav":"linear-gradient(135deg,#ff8c42,#e06820)",
    "--dot":"#ff8c42","--dotbar":"linear-gradient(90deg,#ff8c42,#e91e8c)",
  },
};

const applyTheme = tid => {
  const t = THEMES[tid]||THEMES.chaho;
  Object.entries(t).forEach(([k,v])=>{ if(k.startsWith("--")) document.documentElement.style.setProperty(k,v); });
};

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --t1:#5bc8d4;--t1d:#3ab0bc;--t1p:#e0f7fa;
    --t2:#d4534a;--t2d:#b83c33;--t2p:#fdecea;
    --bg:#f7fbfc;--card:rgba(255,255,255,.88);
    --ink:#2a2a2a;--mid:#7a8a8a;--light:#b8cccc;--shadow:rgba(60,140,150,0.13);
    --hbg:rgba(255,255,255,.88);--hborder:rgba(91,200,212,.2);
    --grad:linear-gradient(150deg,#e6f8fa 0%,#f7fbfc 40%,#fdf0ee 80%,#fce8e6 100%);
    --btnme:linear-gradient(135deg,#d4534a,#b83c33);
    --btnnav:linear-gradient(135deg,#5bc8d4,#3ab0bc);
    --dot:#5bc8d4;--dotbar:linear-gradient(90deg,#5bc8d4,#d4534a);
    --font:'Nunito',sans-serif;--font-j:'Zen Kurenaido',sans-serif;
  }
  body{font-family:var(--font);color:var(--ink);overscroll-behavior:none;background:var(--bg);}
  textarea:focus,input:focus,button:focus{outline:none;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:var(--t1);border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes float2{0%,100%{transform:translateY(0)rotate(-3deg)}50%{transform:translateY(-7px)rotate(3deg)}}
  @keyframes blink {0%,88%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes wag   {0%,100%{transform:rotate(0)}25%{transform:rotate(18deg)}75%{transform:rotate(-14deg)}}
  @keyframes shake {0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-5px)}50%{transform:translateX(5px)}}
  @keyframes slideInR{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}
  @keyframes slideInL{from{transform:translateX(-100%);opacity:0}to{transform:none;opacity:1}}
  @keyframes spin  {to{transform:rotate(360deg)}}
  @keyframes pulse {0%,100%{opacity:.55}50%{opacity:1}}
`;
const injectCSS=c=>{const s=document.createElement("style");s.textContent=c;document.head.appendChild(s);};
injectCSS(CSS);

// ── Logo（確実に読める・M PLUS Rounded 1c・ポップ太字・白縁取り）
const ChahoLogo = ({ size = "md" }) => {
  const fs  = size === "lg" ? 42  : size === "sm" ? 18  : 30;
  const sw  = size === "lg" ? 8   : size === "sm" ? 3.5 : 6;   // 白縁の太さ
  const gap = size === "lg" ? 2   : size === "sm" ? 1   : 1;

  // text-shadow で白い縁取りを8方向に出す（-webkit-text-stroke の代わり）
  const makeShadow = (w) => {
    const s = [];
    for (let x = -w; x <= w; x++) {
      for (let y = -w; y <= w; y++) {
        if (x === 0 && y === 0) continue;
        s.push(`${x}px ${y}px 0 white`);
      }
    }
    return s.join(", ");
  };

  const baseStyle = {
    fontFamily: "'M PLUS Rounded 1c', 'Nunito', sans-serif",
    fontWeight: 900,
    fontSize: fs,
    lineHeight: 1,
    letterSpacing: gap,
    display: "inline-block",
    textShadow: makeShadow(sw),
    filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
    WebkitTextStroke: `${sw*0.5}px white`,
    paintOrder: "stroke fill",
  };

  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap: size==="lg"?3:size==="sm"?1:2, lineHeight:1 }}>
      <span style={{ ...baseStyle, color:"#5bc8d4" }}>チャ</span>
      <span style={{ ...baseStyle, color:"#d4534a" }}>ホ</span>
      <span style={{ ...baseStyle, color:"#5bc8d4" }}>！</span>
    </span>
  );
};

// ── SVG キャラ（常に水色×茜色固定）
const PupSVG=({size=80})=>(<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
  <ellipse cx="26" cy="30" rx="14" ry="19" fill="#5bc8d4" transform="rotate(-15 26 30)"/>
  <ellipse cx="50" cy="72" rx="26" ry="20" fill="white"/>
  <circle cx="50" cy="44" r="26" fill="white"/>
  <ellipse cx="58" cy="52" rx="12" ry="8" fill="white"/>
  <ellipse cx="63" cy="50" rx="6" ry="4" fill="#3a3a3a"/>
  <ellipse cx="42" cy="40" rx="4" ry="4.5" fill="#3a3a3a" style={{animation:"blink 4s infinite"}}/>
  <ellipse cx="56" cy="40" rx="4" ry="4.5" fill="#3a3a3a" style={{animation:"blink 4s .15s infinite"}}/>
  <circle cx="43.5" cy="38.5" r="1.5" fill="white"/><circle cx="57.5" cy="38.5" r="1.5" fill="white"/>
  <path d="M76 68 Q90 55 84 45" stroke="#3ab0bc" strokeWidth="5" strokeLinecap="round" fill="none" style={{animation:"wag 1.2s ease-in-out infinite",transformOrigin:"76px 68px"}}/>
  <circle cx="38" cy="50" r="5" fill="#e0f7fa" opacity=".9"/><circle cx="65" cy="50" r="5" fill="#e0f7fa" opacity=".9"/>
  <path d="M52 56 Q56 61 62 58" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" fill="none"/>
</svg>);

const BotSVG=({size=80})=>(<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
  <ellipse cx="50" cy="75" rx="28" ry="18" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
  <rect x="43" y="54" width="14" height="10" rx="7" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
  <circle cx="50" cy="40" r="28" fill="white" stroke="#e8d0ce" strokeWidth="1.5"/>
  <line x1="50" y1="13" x2="50" y2="5" stroke="#d4534a" strokeWidth="3" strokeLinecap="round"/>
  <circle cx="50" cy="4" r="3.5" fill="#d4534a"/>
  <rect x="30" y="35" width="40" height="10" rx="5" fill="#d4534a" opacity=".2"/>
  <rect x="34" y="37" width="32" height="6" rx="3" fill="#d4534a" opacity=".55"/>
  <rect x="36" y="37.5" width="10" height="5" rx="2.5" fill="#b83c33"/><rect x="54" y="37.5" width="10" height="5" rx="2.5" fill="#b83c33"/>
  <path d="M38 52 Q50 57 62 52" stroke="#d8b0ae" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  <ellipse cx="16" cy="72" rx="8" ry="12" fill="white" stroke="#e8d0ce" strokeWidth="1.5" transform="rotate(15 16 72)"/>
  <ellipse cx="84" cy="72" rx="8" ry="12" fill="white" stroke="#e8d0ce" strokeWidth="1.5" transform="rotate(-15 84 72)"/>
  <circle cx="34" cy="46" r="5" fill="#fdecea" opacity=".9"/><circle cx="66" cy="46" r="5" fill="#fdecea" opacity=".9"/>
  <path d="M46 72 C46 70 50 67 50 70 C50 67 54 70 54 72 C54 75 50 78 50 78 C50 78 46 75 46 72Z" fill="#d4534a" opacity=".55"/>
</svg>);

const BgDecor=()=>(
  <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    <div style={{position:"absolute",inset:0,background:"var(--grad)"}}/>
    <div style={{position:"absolute",bottom:55,left:-8,opacity:.13}}><PupSVG size={120}/></div>
    <div style={{position:"absolute",top:45,right:-8,opacity:.11}}><BotSVG size={110}/></div>
    {["13%:9%:♡:#d4534a:18","78%:16%:✦:#5bc8d4:15","57%:6%:♡:#5bc8d4:13",
      "22%:72%:✦:#d4534a:16","68%:80%:♡:#d4534a:11","8%:47%:⭐:#f5d5a0:13","86%:52%:⭐:#f5d5a0:14"
    ].map((s,i)=>{const[x,y,c,col,fs]=s.split(":");
      return <span key={i} style={{position:"absolute",left:x,top:y,color:col,fontSize:parseInt(fs),opacity:.35,
        animation:`float ${2.5+i*.3}s ease-in-out infinite`,animationDelay:`${i*.25}s`}}>{c}</span>;})}
  </div>
);

const fmt=ts=>new Date(ts).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
const fmtDate=ts=>new Date(ts).toLocaleDateString("ja-JP",{month:"long",day:"numeric"});

const INIT_MSGS=[
  {id:1,from:"them",type:"text",body:"おはよう ☀️",ts:Date.now()-86400000},
  {id:2,from:"me",type:"text",body:"おはよう！今日もよろしく 🌊",ts:Date.now()-86000000},
  {id:3,from:"them",type:"text",body:"昨日の写真、送るね",ts:Date.now()-3600000},
  {id:4,from:"them",type:"image",body:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",ts:Date.now()-3500000},
  {id:5,from:"me",type:"text",body:"わあ、きれい！ありがとう 🌸",ts:Date.now()-3000000},
];
const INIT_NOTES=[
  {id:1,title:"行きたい場所リスト 🗺",body:"京都・奈良\n北海道（冬）\n沖縄の離島",ts:Date.now()-100000,author:"them"},
  {id:2,title:"記念日メモ 💕",body:"最初に会った日: 3月15日\n初デート: 4月2日",ts:Date.now()-50000,author:"me"},
];
const INIT_ALBUM=["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80","https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80","https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80","https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80"];
const INIT_PROFILES={me:{name:"水谷",nickname:"",birthday:"",birthplace:"",job:"",story:"",hobbies:"",likes:"",food:"",alcohol:"",emoji:"🌊"},them:{name:"茜",nickname:"",birthday:"",birthplace:"",job:"",story:"",hobbies:"",likes:"",food:"",alcohol:"",emoji:"🌺"}};

// ── Lock
const LockScreen=({onUnlock,pin:savedPin})=>{
  const [pin,setPin]=useState("");const [shake,setShake]=useState(false);const [hint,setHint]=useState(false);
  const press=d=>{if(pin.length>=4)return;const next=pin+d;setPin(next);
    if(next.length===4){if(next===savedPin){setTimeout(()=>onUnlock(),280);}else{setShake(true);setTimeout(()=>{setPin("");setShake(false);},700);}}};
  const KEYS=["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return(<div style={{position:"relative",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,overflow:"hidden",background:"var(--grad)"}}>
    <BgDecor/>
    <div style={{position:"absolute",left:"5%",bottom:"10%",animation:"float 3s ease-in-out infinite",zIndex:1}}><PupSVG size={80}/></div>
    <div style={{position:"absolute",right:"4%",top:"14%",animation:"float2 3.5s ease-in-out infinite",zIndex:1}}><BotSVG size={76}/></div>
    <div style={{position:"relative",zIndex:2,background:"var(--card)",backdropFilter:"blur(20px)",borderRadius:32,padding:"28px 34px",boxShadow:"0 8px 40px var(--shadow)",border:"1.5px solid rgba(255,255,255,.7)",display:"flex",flexDirection:"column",alignItems:"center",gap:22,minWidth:278}}>
      <ChahoLogo size="lg"/>
      <div style={{display:"flex",gap:14,animation:shake?"shake .5s":"none"}}>
        {[0,1,2,3].map(i=>(<div key={i} style={{width:14,height:14,borderRadius:"50%",transition:"all .15s",background:i<pin.length?"var(--t1)":"transparent",border:"2.5px solid",borderColor:i<pin.length?"var(--t1)":"var(--light)",boxShadow:i<pin.length?"0 0 8px var(--t1p)":"none"}}/>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,62px)",gap:9}}>
        {KEYS.map((k,i)=>(<button key={i} onClick={()=>k==="⌫"?setPin(p=>p.slice(0,-1)):k?press(k):null}
          style={{height:62,borderRadius:18,background:k?"rgba(128,128,128,.1)":"transparent",border:k?"1.5px solid rgba(128,128,128,.2)":"none",color:"var(--ink)",fontSize:k==="⌫"?16:20,fontFamily:"var(--font)",fontWeight:800,cursor:k?"pointer":"default",transition:"all .12s"}}
          onMouseEnter={e=>k&&(e.currentTarget.style.background="rgba(128,128,128,.22)")}
          onMouseLeave={e=>k&&(e.currentTarget.style.background="rgba(128,128,128,.1)")}>{k}</button>))}
      </div>
      <button onClick={()=>setHint(!hint)} style={{background:"none",border:"none",color:"var(--light)",fontSize:11,cursor:"pointer"}}>
        {hint?`💡 PIN: ${savedPin}（デモ用）`:"PINを忘れた？"}</button>
    </div>
  </div>);
};

// ── Chat
const PupMini=()=>(<svg viewBox="0 0 100 100" width="28" height="28"><ellipse cx="26" cy="30" rx="14" ry="19" fill="#5bc8d4" transform="rotate(-15 26 30)"/><circle cx="50" cy="44" r="26" fill="white"/><ellipse cx="58" cy="52" rx="12" ry="8" fill="white"/><ellipse cx="63" cy="50" rx="6" ry="4" fill="#3a3a3a"/><ellipse cx="42" cy="40" rx="4" ry="4.5" fill="#3a3a3a"/><ellipse cx="56" cy="40" rx="4" ry="4.5" fill="#3a3a3a"/><circle cx="38" cy="50" r="5" fill="#e0f7fa" opacity=".9"/></svg>);
const BotMini=()=>(<svg viewBox="0 0 100 100" width="28" height="28"><circle cx="50" cy="40" r="28" fill="white" stroke="#e8d0ce" strokeWidth="2"/><rect x="34" y="37" width="32" height="6" rx="3" fill="#b83c33" opacity=".7"/><circle cx="34" cy="46" r="4" fill="#fdecea" opacity=".9"/><circle cx="66" cy="46" r="4" fill="#fdecea" opacity=".9"/><path d="M38 52 Q50 57 62 52" stroke="#d8b0ae" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>);

const Bubble=({msg})=>{const me=msg.from==="me";return(
  <div style={{display:"flex",justifyContent:me?"flex-end":"flex-start",animation:"fadeUp .3s ease"}}>
    {!me&&<div style={{width:28,height:28,marginRight:6,flexShrink:0,marginTop:"auto"}}><PupMini/></div>}
    <div style={{maxWidth:"66%",background:me?"var(--btnme)":"var(--card)",color:me?"white":"var(--ink)",
      borderRadius:me?"20px 20px 4px 20px":"20px 20px 20px 4px",padding:msg.type==="image"?4:"9px 13px",
      boxShadow:"0 2px 10px var(--shadow)",overflow:"hidden",border:me?"none":"1px solid rgba(128,128,128,.08)"}}>
      {msg.type==="image"?<img src={msg.body} alt="" style={{display:"block",width:"100%",maxWidth:200,borderRadius:14}}/>
        :<span style={{fontSize:14,lineHeight:1.6,fontWeight:600}}>{msg.body}</span>}
      <div style={{fontSize:10,color:me?"rgba(255,255,255,.65)":"var(--light)",textAlign:"right",marginTop:msg.type==="image"?2:3,paddingRight:msg.type==="image"?5:0}}>{fmt(msg.ts)}</div>
    </div>
    {me&&<div style={{width:28,height:28,marginLeft:6,flexShrink:0,marginTop:"auto"}}><BotMini/></div>}
  </div>);};

const REPLIES=["そうだね～😊","わかる！","ありがとう💕","え、ほんとに！?","いいね🌊","かわいい～","最高🎉","またね♡","楽しみ！✨","好きだよ💕","ほんとに？！"];
const ChatTab=({messages,setMessages})=>{
  const [text,setText]=useState("");const endRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=()=>{if(!text.trim())return;setMessages(m=>[...m,{id:Date.now(),from:"me",type:"text",body:text.trim(),ts:Date.now()}]);setText("");
    setTimeout(()=>setMessages(m=>[...m,{id:Date.now()+1,from:"them",type:"text",body:REPLIES[Math.floor(Math.random()*REPLIES.length)],ts:Date.now()}]),900+Math.random()*600);};
  const sendImg=()=>{const u=["https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80","https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80"];
    setMessages(m=>[...m,{id:Date.now(),from:"me",type:"image",body:u[Math.floor(Math.random()*u.length)],ts:Date.now()}]);};
  const groups=[];let ld=null;
  messages.forEach(msg=>{const d=fmtDate(msg.ts);if(d!==ld){groups.push({type:"date",label:d});ld=d;}groups.push({type:"msg",msg});});
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{flex:1,overflowY:"auto",padding:"14px 10px",display:"flex",flexDirection:"column",gap:10}}>
      {groups.map((g,i)=>g.type==="date"
        ?<div key={i} style={{textAlign:"center",fontSize:11,color:"var(--mid)",margin:"4px 0",display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,height:1,background:"rgba(128,128,128,.15)"}}/><span style={{background:"var(--card)",padding:"2px 10px",borderRadius:10,fontWeight:700,fontSize:10}}>{g.label}</span><div style={{flex:1,height:1,background:"rgba(128,128,128,.15)"}}/>
        </div>:<Bubble key={g.msg.id} msg={g.msg}/>)}
      <div ref={endRef}/>
    </div>
    <div style={{padding:"8px 10px 12px",background:"var(--hbg)",backdropFilter:"blur(12px)",borderTop:"1px solid var(--hborder)",display:"flex",gap:8,alignItems:"flex-end"}}>
      <button onClick={sendImg} style={{width:38,height:38,borderRadius:19,border:"1.5px solid var(--hborder)",background:"rgba(128,128,128,.08)",cursor:"pointer",fontSize:15,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>🖼</button>
      <textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
        rows={1} placeholder="メッセージ… (Enterで送信)"
        style={{flex:1,resize:"none",border:"1.5px solid var(--hborder)",borderRadius:20,padding:"8px 13px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)",lineHeight:1.5,maxHeight:80}}/>
      <button onClick={send} style={{width:38,height:38,borderRadius:19,border:"none",flexShrink:0,background:text.trim()?"var(--btnme)":"var(--light)",color:"white",fontSize:15,cursor:text.trim()?"pointer":"default",transition:"background .2s",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
    </div>
  </div>);};

// ── Notes
const NotesTab=({notes,setNotes})=>{
  const [active,setActive]=useState(null);const [form,setForm]=useState({title:"",body:""});
  const openNote=n=>{setActive(n.id);setForm({title:n.title,body:n.body});};
  const save=()=>{if(!form.title.trim()&&!form.body.trim()){setActive(null);return;}
    if(active==="new")setNotes(n=>[...n,{id:Date.now(),...form,ts:Date.now(),author:"me"}]);
    else setNotes(n=>n.map(x=>x.id===active?{...x,...form,ts:Date.now()}:x));setActive(null);};
  if(active!==null)return(<div style={{display:"flex",flexDirection:"column",height:"100%",animation:"fadeIn .2s"}}>
    <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",backdropFilter:"blur(12px)"}}>
      <button onClick={()=>setActive(null)} style={{background:"var(--t1p)",border:"none",borderRadius:12,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--t1d)",fontWeight:700}}>←</button>
      <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="タイトル"
        style={{flex:1,fontFamily:"var(--font)",fontSize:15,fontWeight:800,border:"none",background:"none",color:"var(--ink)"}}/>
      <button onClick={save} style={{background:"var(--btnnav)",color:"white",border:"none",borderRadius:16,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:700}}>保存</button>
    </div>
    <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="ここに書く… ✏️"
      style={{flex:1,padding:"16px",resize:"none",border:"none",fontFamily:"var(--font)",fontSize:14,lineHeight:1.9,background:"transparent",color:"var(--ink)",fontWeight:600}}/>
  </div>);
  return(<div style={{padding:14,overflowY:"auto",height:"100%"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:19,fontWeight:900,color:"var(--t1d)"}}>Notes 📝</div>
      <button onClick={()=>{setActive("new");setForm({title:"",body:""}); }} style={{background:"var(--btnnav)",color:"white",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:800}}>+ 新規</button>
    </div>
    {notes.length===0&&<div style={{textAlign:"center",color:"var(--light)",fontSize:13,marginTop:40,padding:"30px 0"}}><div style={{fontSize:36,marginBottom:8}}>📝</div>まだノートがありません</div>}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {notes.map(n=>(<div key={n.id} onClick={()=>openNote(n)}
        style={{background:"var(--card)",borderRadius:18,padding:"13px 15px",boxShadow:"0 2px 12px var(--shadow)",cursor:"pointer",border:"1px solid rgba(128,128,128,.08)",animation:"fadeUp .3s ease",position:"relative"}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:4,color:"var(--ink)"}}>{n.title||"無題"}</div>
        <div style={{fontSize:12,color:"var(--mid)",lineHeight:1.6}}>{n.body.slice(0,50)}{n.body.length>50?"…":""}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:10,color:"var(--light)"}}>
          <span style={{background:"var(--t1p)",padding:"2px 7px",borderRadius:8,fontWeight:700,color:"var(--t1d)"}}>{n.author==="me"?"🌊 水谷":"🌺 茜"}</span>
          <span>{fmtDate(n.ts)}</span>
        </div>
        <button onClick={e=>{e.stopPropagation();setNotes(ns=>ns.filter(x=>x.id!==n.id));}} style={{position:"absolute",top:8,right:10,background:"none",border:"none",color:"var(--light)",fontSize:16,cursor:"pointer"}}>×</button>
      </div>))}
    </div>
  </div>);};

// ── Album
// ── Album Tab（カメラ・フォト取り込み対応）
const AlbumTab = ({ photos, setPhotos }) => {
  const [lightbox, setLightbox]   = useState(null);
  const [showMenu, setShowMenu]   = useState(false);
  const fileInputRef              = useRef(null);
  const cameraInputRef            = useRef(null);

  // ファイル読み込み共通処理（複数選択対応）
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const readers = Array.from(files).map(file => {
      return new Promise(resolve => {
        // 画像ファイルのみ受け付け
        if (!file.type.startsWith("image/")) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) setPhotos(p => [...valid, ...p]);
    });
    setShowMenu(false);
  };

  const fmtDateAlbum = ts => new Date(ts).toLocaleDateString("ja-JP", { month:"short", day:"numeric" });

  return (
    <div style={{ height:"100%", overflowY:"auto" }}>
      {/* ヘッダー */}
      <div style={{ padding:"14px 14px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:19, fontWeight:900, color:"var(--t1d)" }}>Album 🖼</div>
        <div style={{ position:"relative" }}>
          <button
            onClick={() => setShowMenu(m => !m)}
            style={{ background:"var(--btnnav)", color:"white", border:"none", borderRadius:20,
              padding:"7px 16px", fontSize:12, cursor:"pointer", fontWeight:800,
              display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:16 }}>＋</span> 追加
          </button>
          {/* 追加メニュー */}
          {showMenu && (
            <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:50,
              background:"var(--card)", borderRadius:18, boxShadow:"0 6px 24px var(--shadow)",
              border:"1px solid var(--hborder)", overflow:"hidden", minWidth:170,
              animation:"fadeUp .18s ease" }}>
              {/* カメラで撮影 */}
              <label style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                cursor:"pointer", fontSize:13, fontWeight:700, color:"var(--ink)",
                borderBottom:"1px solid var(--hborder)" }}
                onMouseEnter={e => e.currentTarget.style.background="var(--t1p)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:22 }}>📷</span>
                <span>カメラで撮影</span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple={false}
                  style={{ display:"none" }}
                  onChange={e => handleFiles(e.target.files)}
                />
              </label>
              {/* フォトライブラリから選ぶ */}
              <label style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                cursor:"pointer", fontSize:13, fontWeight:700, color:"var(--ink)" }}
                onMouseEnter={e => e.currentTarget.style.background="var(--t1p)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <span style={{ fontSize:22 }}>🖼️</span>
                <span>フォルダから選ぶ</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display:"none" }}
                  onChange={e => handleFiles(e.target.files)}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* メニューを閉じるオーバーレイ */}
      {showMenu && (
        <div onClick={() => setShowMenu(false)}
          style={{ position:"fixed", inset:0, zIndex:49 }} />
      )}

      {/* 写真枚数 */}
      {photos.length > 0 && (
        <div style={{ padding:"0 14px 8px", fontSize:11, color:"var(--mid)", fontWeight:700 }}>
          {photos.length}枚の思い出 📸
        </div>
      )}

      {/* グリッド */}
      {photos.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          height:"60%", gap:14, color:"var(--light)" }}>
          <span style={{ fontSize:52 }}>📷</span>
          <div style={{ fontSize:13, fontWeight:700, textAlign:"center", lineHeight:1.8 }}>
            2人の思い出を追加しよう<br/>
            <span style={{ fontSize:11, color:"var(--light)" }}>カメラまたはフォルダから選べるよ</span>
          </div>
        </div>
      ) : (
        <div style={{ padding:"0 10px 20px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position:"relative", aspectRatio:"1", overflow:"hidden",
              borderRadius:12, animation:"fadeIn .3s" }}>
              <img
                src={url} alt=""
                onClick={() => setLightbox(url)}
                style={{ width:"100%", height:"100%", objectFit:"cover", cursor:"pointer", display:"block" }}
              />
              <button
                onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                style={{ position:"absolute", top:4, right:4, width:22, height:22, borderRadius:11,
                  background:"rgba(0,0,0,.45)", border:"none", color:"white",
                  fontSize:12, cursor:"pointer", fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ライトボックス */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.9)",
            display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:200, animation:"fadeIn .2s" }}>
          <img src={lightbox} alt=""
            style={{ maxWidth:"94vw", maxHeight:"84vh", borderRadius:16,
              boxShadow:"0 8px 40px rgba(0,0,0,.5)" }} />
          <div onClick={() => setLightbox(null)}
            style={{ position:"absolute", top:20, right:20, width:36, height:36, borderRadius:18,
              background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center",
              justifyContent:"center", color:"white", fontWeight:800, fontSize:20, cursor:"pointer" }}>
            ×
          </div>
        </div>
      )}
    </div>
  );
};

// ── Profile
const PFIELDS=[{key:"name",label:"名前",placeholder:"フルネーム",icon:"👤"},{key:"nickname",label:"ニックネーム",placeholder:"あだ名",icon:"💬"},{key:"birthday",label:"誕生日",placeholder:"例: 1995年4月2日",icon:"🎂"},{key:"birthplace",label:"出身地",placeholder:"例: 東京都",icon:"📍"},{key:"job",label:"職業",placeholder:"例: デザイナー",icon:"💼"},{key:"story",label:"生い立ち・自己紹介",placeholder:"どんな子ども時代？大切な思い出…",icon:"📖",multi:true},{key:"hobbies",label:"趣味",placeholder:"例: カフェ巡り、読書、写真",icon:"🎨"},{key:"likes",label:"好きなこと",placeholder:"例: 雨の日の映画、夕焼け",icon:"❤️"},{key:"food",label:"好きな食べ物",placeholder:"例: カルボナーラ、たこ焼き",icon:"🍜"},{key:"alcohol",label:"好きなお酒",placeholder:"例: ワイン、クラフトビール",icon:"🍷"}];
const ProfileTab=({profiles,setProfiles})=>{
  const [viewing,setViewing]=useState("me");const [editing,setEditing]=useState(false);const [form,setForm]=useState(null);
  const p=profiles[viewing];
  if(editing&&form)return(<div style={{display:"flex",flexDirection:"column",height:"100%",animation:"fadeIn .2s"}}>
    <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",backdropFilter:"blur(12px)",flexShrink:0}}>
      <button onClick={()=>setEditing(false)} style={{background:"var(--t1p)",border:"none",borderRadius:12,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--t1d)",fontWeight:700}}>←</button>
      <span style={{flex:1,fontSize:14,fontWeight:800,color:"var(--ink)"}}>{viewing==="me"?"水谷":"茜"}のプロフィール編集</span>
      <button onClick={()=>{setProfiles(prev=>({...prev,[viewing]:form}));setEditing(false);}} style={{background:"var(--btnnav)",color:"white",border:"none",borderRadius:16,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:700}}>保存</button>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{width:56,height:56,borderRadius:28,background:viewing==="me"?"linear-gradient(135deg,#5bc8d4,#3ab0bc)":"linear-gradient(135deg,#d4534a,#b83c33)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{form.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:5}}>アイコン絵文字</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {["🌊","🌺","🐾","🤖","🌸","🦊","🐻","🐰","🌟","💫","🎀","🎸"].map(e=>(<button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} style={{width:30,height:30,borderRadius:15,border:form.emoji===e?"2px solid var(--t1)":"1.5px solid var(--light)",background:form.emoji===e?"var(--t1p)":"var(--card)",cursor:"pointer",fontSize:15}}>{e}</button>))}
          </div>
        </div>
      </div>
      {PFIELDS.map(field=>(<div key={field.key} style={{marginBottom:13}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:5}}>{field.icon} {field.label}</div>
        {field.multi?<textarea value={form[field.key]} onChange={e=>setForm(f=>({...f,[field.key]:e.target.value}))} placeholder={field.placeholder} rows={3}
          style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:14,padding:"8px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)",resize:"none",lineHeight:1.7}}/>
        :<input value={form[field.key]} onChange={e=>setForm(f=>({...f,[field.key]:e.target.value}))} placeholder={field.placeholder}
          style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:14,padding:"8px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)"}}/>}
      </div>))}
    </div>
  </div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{padding:"12px 14px 0",flexShrink:0}}>
      <div style={{display:"flex",background:"rgba(128,128,128,.1)",borderRadius:20,padding:4,gap:4}}>
        {["me","them"].map(who=>(<button key={who} onClick={()=>setViewing(who)}
          style={{flex:1,padding:"7px 0",borderRadius:16,border:"none",fontFamily:"var(--font)",fontSize:13,fontWeight:800,cursor:"pointer",transition:"all .2s",
            background:viewing===who?(who==="me"?"linear-gradient(135deg,#5bc8d4,#3ab0bc)":"linear-gradient(135deg,#d4534a,#b83c33)"):"transparent",
            color:viewing===who?"white":"var(--mid)"}}>
          {profiles[who].emoji} {who==="me"?"水谷":"茜"}
        </button>))}
      </div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
      <div style={{background:"var(--card)",borderRadius:24,padding:"18px",marginBottom:14,textAlign:"center",border:"1px solid rgba(128,128,128,.08)",position:"relative",boxShadow:"0 2px 14px var(--shadow)"}}>
        <div style={{width:68,height:68,borderRadius:34,background:viewing==="me"?"linear-gradient(135deg,#5bc8d4,#3ab0bc)":"linear-gradient(135deg,#d4534a,#b83c33)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 10px"}}>{p.emoji}</div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:3,color:"var(--ink)"}}>{p.name||"名前未設定"}</div>
        {p.nickname&&<div style={{fontSize:13,color:"var(--mid)",fontWeight:600}}>「{p.nickname}」</div>}
        {(p.birthday||p.birthplace)&&<div style={{fontSize:12,color:"var(--mid)",marginTop:6,display:"flex",justifyContent:"center",gap:12}}>{p.birthday&&<span>🎂 {p.birthday}</span>}{p.birthplace&&<span>📍 {p.birthplace}</span>}</div>}
        {p.job&&<div style={{fontSize:12,color:"var(--mid)",marginTop:3}}>💼 {p.job}</div>}
        <button onClick={()=>{setForm({...p});setEditing(true);}} style={{position:"absolute",top:12,right:12,background:"var(--t1p)",border:"1px solid var(--hborder)",borderRadius:12,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:700,color:"var(--t1d)"}}>✏️ 編集</button>
      </div>
      {[{key:"story",label:"生い立ち",icon:"📖"},{key:"hobbies",label:"趣味",icon:"🎨"},{key:"likes",label:"好きなこと",icon:"❤️"},{key:"food",label:"好きな食べ物",icon:"🍜"},{key:"alcohol",label:"好きなお酒",icon:"🍷"}
      ].map(f=>p[f.key]&&(<div key={f.key} style={{background:"var(--card)",borderRadius:18,padding:"13px 15px",marginBottom:10,boxShadow:"0 2px 10px var(--shadow)",border:"1px solid rgba(128,128,128,.06)"}}>
        <div style={{fontSize:11,fontWeight:800,color:"var(--mid)",marginBottom:6}}>{f.icon} {f.label}</div>
        <div style={{fontSize:13,lineHeight:1.7,fontWeight:600,whiteSpace:"pre-line",color:"var(--ink)"}}>{p[f.key]}</div>
      </div>))}
    </div>
  </div>);};

// ── 終電逆算モーダル（強化版）
const LastTrainModal=({onClose})=>{
  const [from,setFrom]=useState("");const [to,setTo]=useState("");const [loading,setLoading]=useState(false);const [result,setResult]=useState(null);
  const nowStr=new Date().toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
  const search=async()=>{
    if(!from.trim()||!to.trim())return;setLoading(true);
    try{
      const prompt=`現在時刻は${nowStr}です。「${from}駅」から「${to}駅」への終電情報をJSON形式で返してください：{"lastTrainTime":"終電の出発時刻（例：23:42）","arrivalTime":"到着予定時刻","transfers":"乗り換え情報（路線名と乗換駅）","leaveSpotBy10":"徒歩10分想定で何時までに現在地を出発すべきか","leaveSpotBy15":"徒歩15分想定の場合","minutesLeft":"現在時刻${nowStr}から終電まで何分あるか（数字のみ）","missedAction":"終電を逃した場合の対応策（タクシーアプリ名など具体的に）","loveComment":"カップルへの優しく可愛い一言"} JSONのみ返してください。`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:700,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("").trim()||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(e){setResult({lastTrainTime:"23:30頃",arrivalTime:"0:30頃",transfers:"お使いの路線をご確認ください",leaveSpotBy10:"23:15までに出発",leaveSpotBy15:"23:10までに出発",minutesLeft:"--",missedAction:"GO・DiDiなどタクシーアプリが便利🚕",loveComment:"終電を気にしながらも、もう少しだけ一緒にいたいよね💕"});}
    setLoading(false);
  };
  const mins=result?.minutesLeft;
  const urgency=mins&&parseInt(mins)<30?"#e06820":mins&&parseInt(mins)<60?"#f5a742":"var(--t1d)";
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300,animation:"fadeIn .2s"}}>
    <div style={{background:"var(--card)",backdropFilter:"blur(20px)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,padding:"22px 18px 32px",maxHeight:"86vh",overflowY:"auto",animation:"fadeUp .3s ease",border:"1px solid rgba(255,255,255,.25)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:18,fontWeight:900,color:"var(--ink)"}}>🌙 終電だいじょぶ？</div>
          <div style={{fontSize:11,color:"var(--mid)",marginTop:2}}>現在時刻 {nowStr}・出発時刻を逆算するよ</div></div>
        <button onClick={onClose} style={{background:"var(--t2p)",border:"none",borderRadius:14,padding:"6px 12px",cursor:"pointer",fontWeight:700,color:"var(--t2d)",fontSize:12}}>とじる</button>
      </div>
      {[["🚉 いまいる（最寄り）駅","例：渋谷、新宿…",from,setFrom,"var(--t2p)"],
        ["🏠 帰る駅・目的地","例：横浜、吉祥寺…",to,setTo,"var(--t2p)"]
      ].map(([label,ph,val,setter,bg])=>(<div key={label} style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:5}}>{label}</div>
        <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph}
          style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:14,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:bg,color:"var(--ink)"}}/>
      </div>))}
      <button onClick={search} style={{width:"100%",padding:"12px",borderRadius:20,border:"none",background:(from.trim()&&to.trim())?"var(--btnme)":"var(--light)",color:"white",fontSize:14,fontWeight:800,cursor:(from.trim()&&to.trim())?"pointer":"default",marginBottom:4}}>
        🔍 終電を逆算する
      </button>
      {loading&&<div style={{textAlign:"center",padding:"22px 0"}}><div style={{width:36,height:36,borderRadius:18,border:"3px solid var(--t2p)",borderTopColor:"var(--t2)",animation:"spin 1s linear infinite",margin:"0 auto 10px"}}/><div style={{fontSize:13,color:"var(--mid)",animation:"pulse 1.5s infinite"}}>終電を調べてるよ…🌙</div></div>}
      {result&&!loading&&(<div style={{marginTop:14,display:"flex",flexDirection:"column",gap:10,animation:"fadeUp .3s ease"}}>
        {/* 終電時刻 大きく */}
        <div style={{background:"var(--t2p)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(212,83,74,.15)"}}>
          <div style={{fontSize:11,fontWeight:800,color:"var(--t2d)",marginBottom:10}}>🌙 終電情報</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[["終電出発",result.lastTrainTime],["到着予定",result.arrivalTime],["残り時間",result.minutesLeft+"分"]].map(([lb,vl])=>(
              <div key={lb} style={{flex:1,background:"rgba(255,255,255,.6)",borderRadius:12,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"var(--mid)",fontWeight:700}}>{lb}</div>
                <div style={{fontSize:lb==="残り時間"?16:18,fontWeight:900,color:lb==="残り時間"?urgency:"var(--t2d)",marginTop:2,lineHeight:1.1}}>{vl}</div>
              </div>))}
          </div>
          {result.transfers&&<div style={{fontSize:12,lineHeight:1.7,fontWeight:600,color:"var(--ink)"}}>{result.transfers}</div>}
        </div>
        {/* 逆算 */}
        <div style={{background:"var(--card)",borderRadius:16,padding:"13px 15px",border:"1px solid var(--hborder)"}}>
          <div style={{fontSize:11,fontWeight:800,color:"var(--mid)",marginBottom:8}}>⏰ いつまでに出発する？（逆算）</div>
          <div style={{display:"flex",gap:8}}>
            {[["🚶 徒歩10分",result.leaveSpotBy10],["🚶 徒歩15分",result.leaveSpotBy15]].map(([lb,vl])=>(
              <div key={lb} style={{flex:1,background:"var(--t1p)",borderRadius:12,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"var(--t1d)",fontWeight:700}}>{lb}</div>
                <div style={{fontSize:15,fontWeight:900,color:"var(--t1d)",marginTop:2}}>{vl}</div>
              </div>))}
          </div>
        </div>
        {result.missedAction&&(<div style={{background:"var(--card)",borderRadius:14,padding:"11px 13px",border:"1px solid var(--hborder)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--mid)",marginBottom:4}}>🚕 乗り遅れたら</div>
          <div style={{fontSize:12,lineHeight:1.7,fontWeight:600,color:"var(--ink)"}}>{result.missedAction}</div>
        </div>)}
        {result.loveComment&&(<div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:14,padding:"11px 13px",border:"1px dashed rgba(128,128,128,.2)"}}>
          <div style={{fontSize:13,lineHeight:1.7,fontWeight:600,fontStyle:"italic",color:"var(--ink)"}}>💕 {result.loveComment}</div>
        </div>)}
        <div style={{display:"flex",gap:8}}>
          <a href={`https://transit.yahoo.co.jp/search/result?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&type=4`} target="_blank" rel="noopener noreferrer"
            style={{flex:1,display:"block",textAlign:"center",background:"var(--btnme)",color:"white",textDecoration:"none",borderRadius:14,padding:"10px",fontSize:12,fontWeight:800}}>🔗 Yahoo!乗換</a>
          <a href={`https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`} target="_blank" rel="noopener noreferrer"
            style={{flex:1,display:"block",textAlign:"center",background:"var(--btnnav)",color:"white",textDecoration:"none",borderRadius:14,padding:"10px",fontSize:12,fontWeight:800}}>📍 Google Maps</a>
        </div>
      </div>)}
    </div>
  </div>);};

// ── 待ち合わせナビ
const MeetNavModal=({onClose})=>{
  const [from,setFrom]=useState("");const [to,setTo]=useState("");const [loading,setLoading]=useState(false);const [result,setResult]=useState(null);
  const search=async()=>{
    if(!to.trim())return;setLoading(true);
    try{
      const prompt=`「${from||"現在地"}」から「${to}」への公共交通機関ルートをカップル向けにJSON形式で：{"route":"経路（改行あり・路線名と乗換駅明記）","time":"所要時間","fare":"運賃目安","walkMin":"最寄り駅から目的地まで徒歩何分","meetTip":"待ち合わせスポットのおすすめと一言"} JSONのみ。`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("").trim()||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(e){setResult({route:"ルート情報を取得できませんでした。Google Mapsでご確認ください。",time:"--",fare:"--",walkMin:"--",meetTip:"駅の改札前が待ち合わせの定番🌟"});}
    setLoading(false);
  };
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:300,animation:"fadeIn .2s"}}>
    <div style={{background:"var(--card)",backdropFilter:"blur(20px)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,padding:"22px 18px 32px",maxHeight:"82vh",overflowY:"auto",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:18,fontWeight:900,color:"var(--ink)"}}>🗺️ いっしょに行こ！</div>
          <div style={{fontSize:11,color:"var(--mid)",marginTop:2}}>待ち合わせ場所への道を教えるね</div></div>
        <button onClick={onClose} style={{background:"var(--t1p)",border:"none",borderRadius:14,padding:"6px 12px",cursor:"pointer",fontWeight:700,color:"var(--t1d)",fontSize:12}}>とじる</button>
      </div>
      {[["🚉 出発地（空白でGPS自動取得）","例：渋谷駅、自宅の最寄り…",from,setFrom,"var(--t1p)"],
        ["📍 待ち合わせ場所","例：原宿駅、六本木ヒルズ…",to,setTo,"var(--t1p)"]
      ].map(([label,ph,val,setter,bg])=>(<div key={label} style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:5}}>{label}</div>
        <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph}
          style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:14,padding:"9px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:bg,color:"var(--ink)"}}/>
      </div>))}
      <button onClick={search} style={{width:"100%",padding:"12px",borderRadius:20,border:"none",background:to.trim()?"var(--btnnav)":"var(--light)",color:"white",fontSize:14,fontWeight:800,cursor:to.trim()?"pointer":"default",marginBottom:4}}>🔍 ルートを調べる</button>
      {loading&&<div style={{textAlign:"center",padding:"22px 0"}}><div style={{width:36,height:36,borderRadius:18,border:"3px solid var(--t1p)",borderTopColor:"var(--t1)",animation:"spin 1s linear infinite",margin:"0 auto 10px"}}/><div style={{fontSize:13,color:"var(--mid)",animation:"pulse 1.5s infinite"}}>ルートを探してるよ…🗺️</div></div>}
      {result&&!loading&&(<div style={{marginTop:14,display:"flex",flexDirection:"column",gap:10,animation:"fadeUp .3s ease"}}>
        <div style={{background:"var(--t1p)",borderRadius:18,padding:"14px 16px"}}>
          <div style={{fontSize:11,fontWeight:800,color:"var(--t1d)",marginBottom:8}}>🚃 ルート案内</div>
          <div style={{fontSize:13,lineHeight:1.8,fontWeight:600,whiteSpace:"pre-line",color:"var(--ink)"}}>{result.route}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["⏱ 所要時間",result.time],["💰 運賃目安",result.fare],["🚶 駅から",result.walkMin]].map(([lb,vl])=>(
            <div key={lb} style={{flex:1,background:"var(--card)",borderRadius:12,padding:"9px",textAlign:"center",border:"1px solid var(--hborder)"}}>
              <div style={{fontSize:9,color:"var(--mid)",fontWeight:700}}>{lb}</div>
              <div style={{fontSize:13,fontWeight:900,color:"var(--t1d)",marginTop:2}}>{vl}</div>
            </div>))}
        </div>
        {result.meetTip&&(<div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:14,padding:"11px 13px",border:"1px dashed rgba(128,128,128,.2)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--mid)",marginBottom:4}}>💕 待ち合わせのコツ</div>
          <div style={{fontSize:13,lineHeight:1.7,fontWeight:600,color:"var(--ink)"}}>{result.meetTip}</div>
        </div>)}
        <a href={`https://www.google.com/maps/dir/${encodeURIComponent(from||"現在地")}/${encodeURIComponent(to)}`} target="_blank" rel="noopener noreferrer"
          style={{display:"block",textAlign:"center",background:"var(--btnnav)",color:"white",textDecoration:"none",borderRadius:14,padding:"11px",fontSize:13,fontWeight:800}}>📱 Google Mapsで開く</a>
      </div>)}
    </div>
  </div>);};

// ── Date Plan
const DATE_CATS=[{id:"drinks",label:"飲み歩き",icon:"🍺",color:"#f5c842"},{id:"food",label:"食べ歩き",icon:"🍜",color:"#f5a742"},{id:"walk",label:"お散歩デート",icon:"🌸",color:"#a8f0c8"},{id:"drive",label:"ドライブ",icon:"🚗",color:"#a8cff0"},{id:"indoor",label:"インドア",icon:"🏠",color:"#c8a8f0"},{id:"free",label:"フリー入力",icon:"✨",color:"#f5a7b8"}];
const PRESET={drinks:[{name:"渋谷ゴールデン街ナイトツアー",area:"東京・渋谷",shops:[{n:"BAR MUSIC",desc:"こだわりカクテルと音楽の隠れ家バー",img:"https://images.unsplash.com/photo-1543007631-283050bb3e8c?w=400&q=80",link:"https://www.google.com/maps/search/渋谷+バー"},{n:"The SG Club",desc:"世界Top50バーテンダーの本格バー",img:"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",link:"https://www.google.com/maps/search/渋谷+カクテルバー"}],comment:"渋谷のネオンに照らされながら2人でグラスを傾ける夜。街の喧騒がBGMになる特別な時間。"}],food:[{name:"浅草・仲見世食べ歩き",area:"東京・浅草",shops:[{n:"亀十",desc:"ふわふわどら焼きの名店",img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",link:"https://www.google.com/maps/search/浅草+亀十"},{n:"舟和",desc:"芋ようかんのお土産処",img:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",link:"https://www.google.com/maps/search/浅草+舟和"}],comment:"提灯が揺れる仲見世通りで気になるものを指差しながら進む。下町の優しい空気が2人を包んでくれた。"}],walk:[{name:"目黒川沿いさんぽ",area:"東京・中目黒",shops:[{n:"目黒川沿い",desc:"春は桜、秋は紅葉のロマンチック川沿い",img:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80",link:"https://www.google.com/maps/search/目黒川"},{n:"蔦屋書店 代官山",desc:"2人でお気に入りの本を選ぶ",img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",link:"https://www.google.com/maps/search/代官山+蔦屋書店"}],comment:"川のせせらぎを聞きながら並んで歩く。お互いの歩調が自然と合って、なんだか嬉しくなってしまった。"}],drive:[{name:"湘南ドライブ＆夕日",area:"神奈川・湘南",shops:[{n:"江の島",desc:"展望台からの絶景と海の幸",img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",link:"https://www.google.com/maps/search/江の島"},{n:"鵠沼海岸",desc:"サーファーが集まるおしゃれビーチ",img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",link:"https://www.google.com/maps/search/鵠沼海岸"}],comment:"窓を少し開けて潮の香りを感じながら走る134号線。君の横顔が夕焼けに染まって綺麗だなって思った。"}],indoor:[{name:"チームラボ＆恵比寿カフェ",area:"東京・恵比寿",shops:[{n:"teamLab Borderless",desc:"光と映像の幻想的な体験型アート",img:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&q=80",link:"https://www.google.com/maps/search/チームラボ"},{n:"SATURDAYS NYC",desc:"ゆったり過ごせるスペシャルティカフェ",img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",link:"https://www.google.com/maps/search/恵比寿+カフェ"}],comment:"光の中で静かに並んでアートを眺める。言葉がなくても感じていることが同じだってわかる瞬間があった。"}]};

const DatePlanTab=({profiles})=>{
  const [step,setStep]=useState("category");const [category,setCategory]=useState(null);const [freeText,setFreeText]=useState("");const [area,setArea]=useState("");const [loading,setLoading]=useState(false);const [plan,setPlan]=useState(null);const [aiComment,setAiComment]=useState("");const [showMeet,setShowMeet]=useState(false);const [showTrain,setShowTrain]=useState(false);
  const pMe=profiles.me;const pThem=profiles.them;
  const gen=async()=>{
    setLoading(true);setStep("result");
    let base=category!=="free"?(PRESET[category]||[])[0]:null;
    try{
      const aHint=area.trim()?`エリア・方面：${area}`:"";
      const prompt=category==="free"
        ?`${pMe.name||"水谷"}と${pThem.name||"茜"}になりきってデートプラン。テーマ：「${freeText}」。${aHint}。JSON：{"planName":"...","area":"...","shops":[{"n":"...","desc":"...","img":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","link":"https://www.google.com/maps/search/..."}],"comment":"..."} JSONのみ。`
        :`${pMe.name||"水谷"}と${pThem.name||"茜"}の「${DATE_CATS.find(c=>c.id===category)?.label}」デート。${aHint}。プラン名：${base?.name}。この2人になりきってデートを振り返る一人称コメント150文字のみ。`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("").trim()||"";
      if(category==="free"){try{const p=JSON.parse(text.replace(/```json|```/g,"").trim());setPlan(p);setAiComment(p.comment||"");}
        catch{setPlan({planName:"カスタムデートプラン",area:area||"東京",shops:[],comment:text});setAiComment(text);}}
      else{setPlan(base);setAiComment(text||base?.comment||"");}
    }catch(e){setPlan(base);setAiComment(base?.comment||"2人だけの特別な時間になりそう💕");}
    setLoading(false);
  };
  const NavBtns=()=>(<div style={{display:"flex",gap:8}}>
    <button onClick={()=>setShowMeet(true)} style={{flex:1,padding:"10px 6px",borderRadius:14,border:"1.5px solid var(--hborder)",background:"var(--t1p)",cursor:"pointer",fontFamily:"var(--font)",fontSize:11,fontWeight:800,color:"var(--t1d)",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:18}}>🗺️</span>いっしょに行こ！</button>
    <button onClick={()=>setShowTrain(true)} style={{flex:1,padding:"10px 6px",borderRadius:14,border:"1.5px solid var(--hborder)",background:"var(--t2p)",cursor:"pointer",fontFamily:"var(--font)",fontSize:11,fontWeight:800,color:"var(--t2d)",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:18}}>🌙</span>終電だいじょぶ？</button>
  </div>);
  if(step==="category")return(<div style={{padding:14,overflowY:"auto",height:"100%"}}>
    <div style={{fontSize:19,fontWeight:900,color:"var(--t2d)",marginBottom:2}}>Date Plan AI 💕</div>
    <div style={{fontSize:12,color:"var(--mid)",marginBottom:12}}>どんなデートがしたい？</div>
    <div style={{marginBottom:12,background:"var(--card)",borderRadius:16,padding:"12px 14px",border:"1px solid var(--hborder)"}}>
      <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:6}}>📍 行きたい方面・エリア（任意）</div>
      <input value={area} onChange={e=>setArea(e.target.value)} placeholder="例：渋谷、鎌倉、大阪、旅行で京都…"
        style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:12,padding:"8px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)"}}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
      {DATE_CATS.map(cat=>(<button key={cat.id} onClick={()=>{setCategory(cat.id);setStep(cat.id==="free"?"input":"confirm");}}
        style={{padding:"14px 8px",borderRadius:16,border:`1.5px solid ${cat.color}66`,background:`${cat.color}22`,cursor:"pointer",fontFamily:"var(--font)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.background=`${cat.color}44`;}} onMouseLeave={e=>{e.currentTarget.style.background=`${cat.color}22`;}}>
        <span style={{fontSize:24}}>{cat.icon}</span><span style={{fontSize:12,fontWeight:800,color:"var(--ink)"}}>{cat.label}</span>
      </button>))}
    </div>
    <NavBtns/>
    {showMeet&&<MeetNavModal onClose={()=>setShowMeet(false)}/>}{showTrain&&<LastTrainModal onClose={()=>setShowTrain(false)}/>}
  </div>);
  if(step==="input")return(<div style={{padding:14,display:"flex",flexDirection:"column",height:"100%",gap:10}}>
    <button onClick={()=>setStep("category")} style={{alignSelf:"flex-start",background:"var(--t1p)",border:"none",borderRadius:12,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--t1d)",fontWeight:700}}>←</button>
    <div style={{fontSize:17,fontWeight:900,color:"var(--t2d)"}}>✨ フリー入力</div>
    <input value={area} onChange={e=>setArea(e.target.value)} placeholder="📍 エリア・方面（任意）" style={{border:"1.5px solid var(--hborder)",borderRadius:12,padding:"8px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)"}}/>
    <textarea value={freeText} onChange={e=>setFreeText(e.target.value)} placeholder="例：夕方から夜にかけてのムーディーなデート…" rows={4}
      style={{border:"1.5px solid var(--hborder)",borderRadius:14,padding:"12px",fontFamily:"var(--font)",fontSize:13,lineHeight:1.7,resize:"none",background:"var(--t1p)",color:"var(--ink)"}}/>
    <button onClick={()=>{if(freeText.trim())gen();}} style={{background:freeText.trim()?"var(--btnme)":"var(--light)",color:"white",border:"none",borderRadius:20,padding:"12px",fontSize:14,fontWeight:800,cursor:freeText.trim()?"pointer":"default"}}>💕 プランを提案してもらう</button>
  </div>);
  if(step==="confirm")return(<div style={{padding:14,display:"flex",flexDirection:"column",gap:12,height:"100%",overflowY:"auto"}}>
    <button onClick={()=>setStep("category")} style={{alignSelf:"flex-start",background:"var(--t1p)",border:"none",borderRadius:12,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--t1d)",fontWeight:700}}>←</button>
    <div style={{background:"var(--card)",borderRadius:16,padding:"12px 14px",border:"1px solid var(--hborder)"}}>
      <div style={{fontSize:11,fontWeight:700,color:"var(--mid)",marginBottom:6}}>📍 エリア・方面（任意）</div>
      <input value={area} onChange={e=>setArea(e.target.value)} placeholder="例：渋谷、鎌倉…" style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:12,padding:"8px 12px",fontFamily:"var(--font)",fontSize:13,fontWeight:600,background:"var(--t1p)",color:"var(--ink)"}}/>
    </div>
    <div style={{textAlign:"center"}}><div style={{fontSize:30,marginBottom:6}}>{DATE_CATS.find(c=>c.id===category)?.icon}</div><div style={{fontSize:17,fontWeight:900,color:"var(--t2d)"}}>{DATE_CATS.find(c=>c.id===category)?.label}プランを提案</div></div>
    <button onClick={gen} style={{background:"var(--btnme)",color:"white",border:"none",borderRadius:20,padding:"14px",fontSize:15,fontWeight:800,cursor:"pointer"}}>💕 プランを提案してもらう</button>
  </div>);
  return(<div style={{height:"100%",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid var(--hborder)",background:"var(--hbg)",flexShrink:0}}>
      <button onClick={()=>{setStep("category");setPlan(null);setAiComment("");}} style={{background:"var(--t1p)",border:"none",borderRadius:12,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"var(--t1d)",fontWeight:700}}>←</button>
      <span style={{fontSize:15,fontWeight:900,color:"var(--t2d)"}}>デートプラン 💕</span>
    </div>
    <div style={{flex:1,overflowY:"auto"}}>
      {loading?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14}}>
        <div style={{width:46,height:46,borderRadius:23,border:"4px solid var(--t1p)",borderTopColor:"var(--t1)",animation:"spin 1s linear infinite"}}/>
        <div style={{fontSize:13,color:"var(--mid)",fontWeight:700,animation:"pulse 1.5s infinite"}}>2人のためのプランを考え中… 💭</div>
      </div>):(<div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
        {plan&&(<>
          <div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:18,padding:"13px",border:"1px solid var(--hborder)"}}>
            <div style={{fontSize:16,fontWeight:900,marginBottom:3,color:"var(--ink)"}}>{plan.planName||plan.name}</div>
            <div style={{fontSize:12,color:"var(--mid)",fontWeight:600}}>📍 {plan.area}</div>
          </div>
          {(plan.shops||[]).map((shop,i)=>(<div key={i} style={{background:"var(--card)",borderRadius:16,overflow:"hidden",boxShadow:"0 3px 12px var(--shadow)",animation:"fadeUp .3s ease"}}>
            {shop.img&&<img src={shop.img} alt="" style={{width:"100%",height:130,objectFit:"cover"}}/>}
            <div style={{padding:"11px 13px"}}>
              <div style={{fontSize:14,fontWeight:900,marginBottom:3,color:"var(--ink)"}}>{shop.n}</div>
              <div style={{fontSize:12,color:"var(--mid)",lineHeight:1.6,marginBottom:8}}>{shop.desc}</div>
              <a href={shop.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--btnnav)",color:"white",textDecoration:"none",borderRadius:12,padding:"5px 12px",fontSize:11,fontWeight:800}}>📍 地図で見る</a>
            </div>
          </div>))}
          {aiComment&&(<div style={{background:"linear-gradient(135deg,var(--t1p),var(--t2p))",borderRadius:18,padding:"14px",border:"1px dashed rgba(128,128,128,.2)"}}>
            <div style={{fontSize:11,fontWeight:800,color:"var(--mid)",marginBottom:6}}>💬 {pMe.name||"水谷"} & {pThem.name||"茜"} より</div>
            <div style={{fontSize:13,lineHeight:1.8,fontWeight:600,fontStyle:"italic",color:"var(--ink)"}}>「{aiComment}」</div>
          </div>)}
          <NavBtns/>
          <button onClick={()=>{setPlan(null);setAiComment("");setStep("confirm");}} style={{background:"var(--t1p)",border:"1.5px solid var(--hborder)",borderRadius:18,padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:"var(--t1d)"}}>🔄 別のプランを見る</button>
        </>)}
        {showMeet&&<MeetNavModal onClose={()=>setShowMeet(false)}/>}{showTrain&&<LastTrainModal onClose={()=>setShowTrain(false)}/>}
      </div>)}
    </div>
  </div>);};


// ══════════════════════════════════════════════════════════════════════════
// KIROKU TAB（きろく：決め事・語録・その他）
// ══════════════════════════════════════════════════════════════════════════
const KIROKU_CATS = [
  { id:"rule",  label:"決め事",  icon:"📜", color:"#5bc8d4", desc:"2人のルール・約束ごと" },
  { id:"quote", label:"語録",    icon:"💬", color:"#d4534a", desc:"名言・面白発言・思い出のセリフ" },
  { id:"other", label:"その他",  icon:"✨", color:"#f5a742", desc:"なんでも自由に記録" },
];

const INIT_KIROKU = [
  { id:1, cat:"rule",  title:"毎週日曜はデーしようの日",  body:"どんなに忙しくても、週1回は会う約束 🗓",   ts:Date.now()-200000, author:"me"   },
  { id:2, cat:"quote", title:"茜の名言",                   body:"「好きって言えなくてごめん、でも好き」",   ts:Date.now()-100000, author:"them" },
  { id:3, cat:"other", label:"その他",  title:"2人の好きな曲", body:"夜に駆ける / たぶん / Subtitle",      ts:Date.now()-50000,  author:"me"   },
];

const KirokuTab = ({ kiroku, setKiroku }) => {
  const [activeCat, setActiveCat] = useState("all");
  const [editing, setEditing]     = useState(null);  // null | "new" | item.id
  const [form, setForm]           = useState({ cat:"rule", title:"", body:"", author:"me" });

  const filtered = activeCat === "all" ? kiroku : kiroku.filter(k => k.cat === activeCat);

  const openNew  = (cat="rule") => { setForm({ cat, title:"", body:"", author:"me" }); setEditing("new"); };
  const openEdit = (item)       => { setForm({ cat:item.cat, title:item.title, body:item.body, author:item.author }); setEditing(item.id); };
  const save = () => {
    if (!form.title.trim() && !form.body.trim()) { setEditing(null); return; }
    if (editing === "new") {
      setKiroku(k => [...k, { id: Date.now(), ...form, ts: Date.now() }]);
    } else {
      setKiroku(k => k.map(x => x.id === editing ? { ...x, ...form, ts: Date.now() } : x));
    }
    setEditing(null);
  };
  const del = id => setKiroku(k => k.filter(x => x.id !== id));

  const catOf = id => KIROKU_CATS.find(c => c.id === id) || KIROKU_CATS[2];

  // ── 編集画面
  if (editing !== null) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", animation:"fadeIn .2s" }}>
      <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10,
        borderBottom:"1px solid var(--hborder)", background:"var(--hbg)", backdropFilter:"blur(12px)", flexShrink:0 }}>
        <button onClick={() => setEditing(null)}
          style={{ background:"var(--t1p)", border:"none", borderRadius:12, padding:"5px 10px", cursor:"pointer", fontSize:13, color:"var(--t1d)", fontWeight:700 }}>←</button>
        <span style={{ flex:1, fontSize:14, fontWeight:800, color:"var(--ink)" }}>
          {editing === "new" ? "新しく記録する" : "記録を編集"}
        </span>
        <button onClick={save}
          style={{ background:"var(--btnnav)", color:"white", border:"none", borderRadius:16, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:700 }}>保存</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>
        {/* カテゴリ選択 */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--mid)", marginBottom:8 }}>カテゴリ</div>
          <div style={{ display:"flex", gap:8 }}>
            {KIROKU_CATS.map(cat => (
              <button key={cat.id} onClick={() => setForm(f => ({ ...f, cat: cat.id }))}
                style={{ flex:1, padding:"9px 4px", borderRadius:14, cursor:"pointer", fontFamily:"var(--font)",
                  border: form.cat === cat.id ? `2px solid ${cat.color}` : "1.5px solid rgba(128,128,128,.18)",
                  background: form.cat === cat.id ? `${cat.color}22` : "transparent",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:20 }}>{cat.icon}</span>
                <span style={{ fontSize:10, fontWeight:800, color:"var(--ink)" }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* 誰が */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--mid)", marginBottom:6 }}>記録者</div>
          <div style={{ display:"flex", gap:8 }}>
            {[["me","🌊 水谷"],["them","🌺 茜"]].map(([who,label]) => (
              <button key={who} onClick={() => setForm(f => ({ ...f, author: who }))}
                style={{ flex:1, padding:"7px", borderRadius:14, cursor:"pointer", fontFamily:"var(--font)",
                  border: form.author === who ? "2px solid var(--t1)" : "1.5px solid rgba(128,128,128,.18)",
                  background: form.author === who ? "var(--t1p)" : "transparent",
                  fontSize:13, fontWeight:800, color: form.author === who ? "var(--t1d)" : "var(--mid)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* タイトル */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--mid)", marginBottom:5 }}>タイトル</div>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="タイトルをつけてね"
            style={{ width:"100%", border:"1.5px solid var(--hborder)", borderRadius:14, padding:"9px 12px",
              fontFamily:"var(--font)", fontSize:14, fontWeight:700, background:"var(--t1p)", color:"var(--ink)" }} />
        </div>
        {/* 内容 */}
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--mid)", marginBottom:5 }}>内容</div>
          <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="内容を書いてね… ✏️" rows={5}
            style={{ width:"100%", border:"1.5px solid var(--hborder)", borderRadius:14, padding:"9px 12px",
              fontFamily:"var(--font)", fontSize:13, fontWeight:600, background:"var(--t1p)", color:"var(--ink)",
              resize:"none", lineHeight:1.8 }} />
        </div>
      </div>
    </div>
  );

  // ── 一覧画面
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* カテゴリフィルター */}
      <div style={{ padding:"12px 14px 0", flexShrink:0 }}>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
          {[{ id:"all", label:"すべて", icon:"📋", color:"var(--t1)" }, ...KIROKU_CATS].map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              style={{ flexShrink:0, padding:"6px 12px", borderRadius:20, cursor:"pointer", fontFamily:"var(--font)",
                border: activeCat === cat.id ? `2px solid ${cat.color}` : "1.5px solid rgba(128,128,128,.18)",
                background: activeCat === cat.id ? `${typeof cat.color === 'string' && cat.color.startsWith('#') ? cat.color+'22' : 'var(--t1p)'}` : "transparent",
                fontSize:12, fontWeight:800, color:"var(--ink)", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* リスト */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
          <button onClick={() => openNew()}
            style={{ background:"var(--btnnav)", color:"white", border:"none", borderRadius:20,
              padding:"7px 16px", fontSize:12, cursor:"pointer", fontWeight:800 }}>+ 記録する</button>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", color:"var(--light)", fontSize:13, marginTop:40, padding:"30px 0" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>📋</div>
            まだ記録がありません
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(item => {
            const cat = catOf(item.cat);
            return (
              <div key={item.id} onClick={() => openEdit(item)}
                style={{ background:"var(--card)", borderRadius:18, padding:"14px 16px",
                  boxShadow:"0 2px 12px var(--shadow)", cursor:"pointer",
                  border:`1.5px solid ${cat.color}33`, animation:"fadeUp .3s ease", position:"relative" }}>
                {/* カテゴリバッジ */}
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                  <span style={{ background:`${cat.color}22`, color: cat.color,
                    border:`1px solid ${cat.color}55`, borderRadius:10,
                    padding:"2px 8px", fontSize:10, fontWeight:800 }}>
                    {cat.icon} {cat.label}
                  </span>
                  <span style={{ fontSize:10, color:"var(--light)", marginLeft:"auto" }}>
                    {item.author === "me" ? "🌊 水谷" : "🌺 茜"}
                  </span>
                </div>
                <div style={{ fontSize:14, fontWeight:800, marginBottom:5, color:"var(--ink)" }}>
                  {item.title || "無題"}
                </div>
                <div style={{ fontSize:12, color:"var(--mid)", lineHeight:1.65, fontWeight:600 }}>
                  {item.body.slice(0, 60)}{item.body.length > 60 ? "…" : ""}
                </div>
                <div style={{ fontSize:10, color:"var(--light)", marginTop:8, textAlign:"right" }}>
                  {fmtDate(item.ts)}
                </div>
                <button onClick={e => { e.stopPropagation(); del(item.id); }}
                  style={{ position:"absolute", top:10, right:12, background:"none", border:"none",
                    color:"var(--light)", fontSize:16, cursor:"pointer" }}>×</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Settings
const SettingsTab=({themeId,setThemeId,pin,setPin})=>{
  const [newPin,setNewPin]=useState("");const [pinMsg,setPinMsg]=useState("");
  const changePin=()=>{
    if(newPin.length!==4||!/^\d{4}$/.test(newPin)){setPinMsg("⚠️ 4桁の数字で入力してね");return;}
    setPin(newPin);setNewPin("");setPinMsg("✅ PINを変更しました！");setTimeout(()=>setPinMsg(""),3000);
  };
  return(<div style={{padding:16,overflowY:"auto",height:"100%"}}>
    <div style={{fontSize:19,fontWeight:900,color:"var(--t1d)",marginBottom:16}}>設定 ⚙️</div>
    {/* テーマ */}
    <div style={{background:"var(--card)",borderRadius:20,padding:"16px",marginBottom:14,boxShadow:"0 2px 12px var(--shadow)",border:"1px solid var(--hborder)"}}>
      <div style={{fontSize:13,fontWeight:800,marginBottom:12,color:"var(--ink)"}}>🎨 テーマ</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {Object.entries(THEMES).map(([tid,t])=>(<button key={tid} onClick={()=>{setThemeId(tid);applyTheme(tid);}}
          style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:16,
            border:themeId===tid?"2px solid var(--t1)":"1.5px solid rgba(128,128,128,.12)",
            background:themeId===tid?"var(--t1p)":"transparent",cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s",textAlign:"left"}}>
          <span style={{fontSize:22}}>{t.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:"var(--ink)"}}>{t.name}</div>
            <div style={{display:"flex",gap:5,marginTop:4}}>
              {[t["--t1"],t["--t2"],t["--bg"]].map((c,i)=>(<div key={i} style={{width:16,height:16,borderRadius:8,background:c,border:"1px solid rgba(128,128,128,.2)"}}/>))}
            </div>
          </div>
          {themeId===tid&&<span style={{color:"var(--t1)",fontSize:18}}>✓</span>}
        </button>))}
      </div>
    </div>
    {/* PIN変更 */}
    <div style={{background:"var(--card)",borderRadius:20,padding:"16px",marginBottom:14,boxShadow:"0 2px 12px var(--shadow)",border:"1px solid var(--hborder)"}}>
      <div style={{fontSize:13,fontWeight:800,marginBottom:4,color:"var(--ink)"}}>🔐 PINを変更</div>
      <div style={{fontSize:11,color:"var(--mid)",marginBottom:10}}>現在のPIN: {"●".repeat(pin.length)}</div>
      <input value={newPin} onChange={e=>setNewPin(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="新しい4桁PINを入力" maxLength={4} type="tel"
        style={{width:"100%",border:"1.5px solid var(--hborder)",borderRadius:14,padding:"9px 12px",fontFamily:"var(--font)",fontSize:16,fontWeight:800,background:"var(--t1p)",color:"var(--ink)",letterSpacing:6,textAlign:"center",marginBottom:8}}/>
      {pinMsg&&<div style={{fontSize:12,color:pinMsg.includes("✅")?"#4caf50":"#e06820",marginBottom:8,fontWeight:700}}>{pinMsg}</div>}
      <button onClick={changePin} style={{width:"100%",padding:"10px",borderRadius:14,border:"none",background:"var(--btnnav)",color:"white",fontSize:13,fontWeight:800,cursor:"pointer"}}>変更する</button>
    </div>
    {/* アプリ情報 */}
    <div style={{background:"var(--card)",borderRadius:20,padding:"16px",boxShadow:"0 2px 12px var(--shadow)",border:"1px solid var(--hborder)"}}>
      <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"var(--ink)"}}>📱 アプリについて</div>
      {[["アプリ名","チャホ！"],["バージョン","1.0.0"],["テーマ",THEMES[themeId]?.name]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--hborder)"}}>
        <span style={{fontSize:12,color:"var(--mid)",fontWeight:600}}>{k}</span>
        <span style={{fontSize:12,fontWeight:800,color:"var(--ink)"}}>{v}</span>
      </div>))}
      <div style={{marginTop:14,textAlign:"center"}}><ChahoLogo size="sm"/><div style={{fontSize:10,color:"var(--light)",marginTop:4}}>🌊 水谷 × 茜 🌺</div></div>
    </div>
  </div>);};

// ── Swipe
const useSwipe=(onLeft,onRight)=>{
  const sx=useRef(null);
  return{onTouchStart:e=>{sx.current=e.touches[0].clientX;},onTouchEnd:e=>{if(sx.current===null)return;const d=e.changedTouches[0].clientX-sx.current;if(Math.abs(d)>48){d<0?onLeft():onRight();}sx.current=null;},onMouseDown:e=>{sx.current=e.clientX;},onMouseUp:e=>{if(sx.current===null)return;const d=e.clientX-sx.current;if(Math.abs(d)>58){d<0?onLeft():onRight();}sx.current=null;}};
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════
const TABS_ORDER=["profile","chat","notes","kiroku","album","date","settings"];
const TABS_META=[{id:"profile",icon:"👤",label:"プロフ"},{id:"chat",icon:"💬",label:"チャット"},{id:"notes",icon:"📝",label:"ノート"},{id:"kiroku",icon:"📋",label:"きろく"},{id:"album",icon:"🖼",label:"アルバム"},{id:"date",icon:"💕",label:"デートAI"},{id:"settings",icon:"⚙️",label:"設定"}];

export default function App(){
  const [unlocked,setUnlocked]=useState(false);
  const [tabIdx,setTabIdx]=useState(1);
  const [animDir,setAnimDir]=useState(null);
  const [messages,setMessages]=useState(INIT_MSGS);
  const [notes,setNotes]=useState(INIT_NOTES);
  const [photos,setPhotos]=useState(INIT_ALBUM);
  const [kiroku,setKiroku]=useState(INIT_KIROKU);
  const [profiles,setProfiles]=useState(INIT_PROFILES);
  const [themeId,setThemeId]=useState("chaho");
  const [pin,setPin]=useState("1234");

  useEffect(()=>{applyTheme("chaho");},[]);

  const goTo=useCallback(idx=>{
    if(idx===tabIdx||idx<0||idx>=TABS_ORDER.length)return;
    setAnimDir(idx>tabIdx?"left":"right");setTabIdx(idx);setTimeout(()=>setAnimDir(null),340);
  },[tabIdx]);

  const swipe=useSwipe(()=>goTo(tabIdx+1),()=>goTo(tabIdx-1));

  if(!unlocked)return(<div style={{height:"100vh",overflow:"hidden"}}><LockScreen onUnlock={()=>setUnlocked(true)} pin={pin}/></div>);

  const renderTab=()=>{
    switch(TABS_ORDER[tabIdx]){
      case"chat":    return <ChatTab     messages={messages}  setMessages={setMessages}/>;
      case"notes":   return <NotesTab    notes={notes}        setNotes={setNotes}/>;
      case"kiroku":  return <KirokuTab   kiroku={kiroku}      setKiroku={setKiroku}/>;
      case"album":   return <AlbumTab    photos={photos}      setPhotos={setPhotos}/>;
      case"profile": return <ProfileTab  profiles={profiles}  setProfiles={setProfiles}/>;
      case"date":    return <DatePlanTab profiles={profiles}/>;
      case"settings":return <SettingsTab themeId={themeId}    setThemeId={setThemeId} pin={pin} setPin={setPin}/>;
      default:       return null;
    }
  };

  return(<div style={{height:"100vh",display:"flex",flexDirection:"column",position:"relative",fontFamily:"var(--font)",overflow:"hidden",background:"var(--bg)"}}>
    <BgDecor/>
    <div style={{position:"relative",zIndex:2,padding:"10px 14px 8px",background:"var(--hbg)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--hborder)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{animation:"bounce 2s ease-in-out infinite"}}><PupSVG size={36}/></div>
        <ChahoLogo size="md"/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{animation:"bounce 2.4s ease-in-out infinite"}}><BotSVG size={36}/></div>
        <button onClick={()=>setUnlocked(false)} style={{background:"var(--t2p)",border:"1.5px solid rgba(128,128,128,.18)",borderRadius:12,padding:"4px 9px",cursor:"pointer",fontSize:13}}>🔒</button>
      </div>
    </div>
    <div style={{position:"relative",zIndex:2,background:"rgba(128,128,128,.07)",padding:"3px 0",display:"flex",justifyContent:"center",gap:5,flexShrink:0}}>
      {TABS_ORDER.map((_,i)=>(<div key={i} onClick={()=>goTo(i)} style={{width:i===tabIdx?18:5,height:5,borderRadius:3,transition:"all .3s",cursor:"pointer",background:i===tabIdx?"var(--dot)":"rgba(128,128,128,.2)"}}/>))}
    </div>
    <div {...swipe} style={{flex:1,overflow:"hidden",position:"relative",zIndex:1,userSelect:"none"}} onMouseDown={e=>swipe.onMouseDown(e)} onMouseUp={e=>swipe.onMouseUp(e)}>
      <div key={tabIdx} style={{height:"100%",animation:animDir?`${animDir==="left"?"slideInR":"slideInL"} .3s ease`:"fadeIn .25s ease"}}>
        {renderTab()}
      </div>
    </div>
    <div style={{position:"relative",zIndex:2,display:"flex",background:"var(--hbg)",backdropFilter:"blur(20px)",borderTop:"1px solid var(--hborder)",padding:"4px 0 10px",flexShrink:0}}>
      {TABS_META.map((t,i)=>(<button key={t.id} onClick={()=>goTo(i)} style={{flex:1,border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,paddingTop:5}}>
        <span style={{fontSize:17,filter:tabIdx===i?"none":"grayscale(50%) opacity(55%)"}}>{t.icon}</span>
        <span style={{fontSize:8.5,fontWeight:800,letterSpacing:.2,color:tabIdx===i?"var(--t1d)":"var(--light)",transition:"color .2s"}}>{t.label}</span>
        {tabIdx===i&&<span style={{width:14,height:3,borderRadius:2,background:"var(--dotbar)",marginTop:1}}/>}
      </button>))}
    </div>
  </div>);
}
