import { useState } from "react";
import { BREAKS, BREAK_ORDER, TIME_OPTIONS } from "./data";
import { createInvite, buildInviteURL } from "./storage";

export default function Creator({ onShare }) {
  const [name, setName] = useState("");
  const [sel, setSel] = useState(null);
  const [time, setTime] = useState(300);

  const go = () => {
    if (!sel) return;
    const sn = name.trim() || "Someone";
    const encoded = createInvite(sn, sel, time);
    const url = buildInviteURL(encoded);
    onShare(url, sel);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Space Mono',monospace",padding:"1.5rem 1rem",overflowY:"auto"}}>
      <div className="scanlines" />
      <div style={{position:"relative",zIndex:10,maxWidth:"420px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:".42rem",letterSpacing:".4em",textTransform:"uppercase",color:"#F2C744",opacity:.45,marginBottom:".6rem"}}>The Human Glitch Report</div>
        <h1 style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"clamp(1.5rem,5vw,2rem)",color:"#E8DCC8",marginBottom:".2rem"}}>Break Invite</h1>
        <p style={{fontSize:".55rem",color:"#E8DCC8",opacity:.25,marginBottom:"1.2rem",fontStyle:"italic",fontFamily:"'Georgia',serif"}}>Pick your poison. Set the clock. Send the link.</p>

        <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} maxLength={20} style={{fontFamily:"'Space Mono',monospace",fontSize:".65rem",background:"rgba(232,220,200,.04)",border:"1px solid rgba(232,220,200,.1)",color:"#E8DCC8",padding:".65rem 1rem",textAlign:"center",outline:"none",width:"100%",marginBottom:"1rem"}}/>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".45rem",marginBottom:".8rem"}}>
          {BREAK_ORDER.map(k => {
            const b = BREAKS[k]; const on = sel===k;
            return (<button key={k} onClick={()=>setSel(k)} style={{background:on?`${b.color}18`:"rgba(232,220,200,.02)",border:`1px solid ${on?b.color:'rgba(232,220,200,.07)'}`,borderRadius:"6px",padding:".55rem .3rem",cursor:"pointer",transition:"all .2s",transform:on?"scale(1.04)":"scale(1)",boxShadow:on?`0 0 12px ${b.color}22`:"none",textAlign:"center"}}>
              <div style={{fontSize:"1.3rem",marginBottom:".15rem"}}>{b.emoji}</div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:".37rem",color:on?b.color:"#E8DCC8",opacity:on?1:.35,lineHeight:1.3}}>{b.label.replace(" Break","")}</div>
            </button>);
          })}
          <button onClick={()=>{setSel(BREAK_ORDER[Math.floor(Math.random()*BREAK_ORDER.length)])}} style={{background:"rgba(232,220,200,.02)",border:"1px solid rgba(232,220,200,.07)",borderRadius:"6px",padding:".55rem .3rem",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:"1.3rem",marginBottom:".15rem"}}>🎰</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:".37rem",color:"#E8DCC8",opacity:.35}}>Random</div>
          </button>
        </div>

        {sel && (
          <div style={{animation:"fadeUp .3s ease"}}>
            <p style={{fontSize:".38rem",letterSpacing:".2em",textTransform:"uppercase",color:"#E8DCC8",opacity:.25,marginBottom:".4rem"}}>How long?</p>
            <div style={{display:"flex",gap:".35rem",justifyContent:"center",marginBottom:".8rem"}}>
              {TIME_OPTIONS.map(t => {
                const on = time===t.value; const bc = BREAKS[sel].color;
                return (<button key={t.value} onClick={()=>setTime(t.value)} style={{background:on?`${bc}20`:"rgba(232,220,200,.03)",border:`1px solid ${on?bc:'rgba(232,220,200,.08)'}`,borderRadius:"4px",padding:".45rem .6rem",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:".1rem"}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:".5rem",fontWeight:700,color:on?bc:"#E8DCC8",opacity:on?1:.4}}>{t.label}</span>
                  <span style={{fontSize:".3rem",color:"#E8DCC8",opacity:.2}}>{t.sub}</span>
                </button>);
              })}
            </div>
            <div style={{background:"rgba(232,220,200,.03)",border:"1px solid rgba(232,220,200,.06)",borderRadius:"4px",padding:".6rem",marginBottom:".8rem"}}>
              <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:".52rem",color:"#E8DCC8",opacity:.4,lineHeight:1.6}}>"{BREAKS[sel].invite}"</p>
            </div>
          </div>
        )}

        <button onClick={go} disabled={!sel} style={{fontFamily:"'Space Mono',monospace",fontSize:".55rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:sel?BREAKS[sel].color:"#333",color:"#fff",border:"none",padding:".8rem 2rem",cursor:!sel?"not-allowed":"pointer",opacity:!sel?.3:1,width:"100%",boxShadow:sel?`0 4px 18px ${BREAKS[sel].color}33`:"none",transition:"all .3s"}}>
          Send the invite
        </button>
        <p style={{fontSize:".32rem",color:"#E8DCC8",opacity:.08,marginTop:".7rem"}}>thehumanglitchreport.com</p>
      </div>
    </div>
  );
}
