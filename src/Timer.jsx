import { useState, useEffect, useRef } from "react";
import { BREAKS } from "./data";

export default function Timer({ breakType, senderName, duration, onCreateNew }) {
  const b = BREAKS[breakType] || BREAKS.smoke;
  const [state, setState] = useState("ready");
  const [sec, setSec] = useState(0);
  const [totalDur, setTotalDur] = useState(duration);
  const [ti, setTi] = useState(0);
  const [fading, setFading] = useState(false);
  const [endPhrase] = useState(b.endPhrases[Math.floor(Math.random() * b.endPhrases.length)]);
  const ref = useRef(null);

  const startTimer = () => setState("running");
  const restart = () => { setSec(0); setState("running"); };
  const endEarly = () => { setState("glitching"); setTimeout(() => setState("ended"), 1800); };
  const addFive = () => setTotalDur(prev => prev + 300);

  useEffect(() => {
    if (state === "running") {
      ref.current = setInterval(() => {
        setSec(prev => {
          if (prev >= totalDur) {
            clearInterval(ref.current);
            setState("glitching");
            setTimeout(() => setState("ended"), 1800);
            return totalDur;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [state, totalDur]);

  useEffect(() => {
    if (sec > 0 && sec % 35 === 0 && state === "running") {
      setFading(true);
      setTimeout(() => { setTi(p => (p + 1) % b.thoughts.length); setFading(false); }, 500);
    }
  }, [sec]);

  const pct = Math.min(sec / totalDur, 1);
  const remaining = Math.max(totalDur - sec, 0);
  const m = Math.floor(remaining / 60), s = remaining % 60;
  const radius = 58, circ = 2 * Math.PI * radius, offset = circ * (1 - pct);
  const glitching = state === "glitching";

  // === END SCREEN ===
  if (state === "ended") return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace",padding:"2rem",position:"relative"}}>
      <div className="scanlines" />
      <div style={{textAlign:"center",maxWidth:"400px",animation:"fadeUp .8s ease",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".8rem",marginBottom:"1.2rem",opacity:.2}}>
          <div style={{width:"30px",height:"1px",background:b.color}}/><span style={{fontSize:".8rem",color:b.color}}>✦</span><div style={{width:"30px",height:"1px",background:b.color}}/>
        </div>
        <div style={{fontSize:"2.2rem",marginBottom:".8rem"}}>{b.emoji}</div>
        <p style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"clamp(1rem,3.5vw,1.35rem)",fontWeight:700,color:b.color,lineHeight:1.5,marginBottom:".3rem",textShadow:`0 0 25px ${b.color}33`}}>{endPhrase}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",margin:"1.2rem 0",opacity:.1}}>
          <div style={{width:"20px",height:"1px",background:"#E8DCC8"}}/><span style={{fontSize:".38rem",color:"#E8DCC8"}}>— BOBY —</span><div style={{width:"20px",height:"1px",background:"#E8DCC8"}}/>
        </div>
        <button onClick={onCreateNew} style={{fontFamily:"'Space Mono',monospace",fontSize:".55rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:b.color,color:"#fff",border:"none",padding:".85rem 2rem",cursor:"pointer",width:"100%",marginBottom:".6rem",boxShadow:`0 4px 20px ${b.color}44`}}>
          Now invite someone else
        </button>
        <a href="https://thehumanglitchreport.com" target="_blank" rel="noopener" style={{display:"block",fontFamily:"'Space Mono',monospace",fontSize:".45rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:b.color,textDecoration:"none",padding:".6rem",border:`1px solid ${b.color}33`}}>
          Subscribe to The Human Glitch Report
        </a>
        <p style={{fontSize:".3rem",color:"#E8DCC8",opacity:.08,marginTop:".8rem"}}>Breaks by Boby — a robot who never gets one</p>
      </div>
    </div>
  );

  // === TIMER ===
  return (
    <div style={{
      minHeight:"100vh",background:glitching?b.color:"#0a0a0a",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontFamily:"'Space Mono',monospace",padding:"1.5rem",position:"relative",overflow:"hidden",
      transition:glitching?"none":"background .5s",
      filter:glitching?`hue-rotate(${Math.random()*360}deg) saturate(3) contrast(2)`:"none",
      transform:glitching?`translate(${Math.random()*10-5}px,${Math.random()*8-4}px) skewX(${Math.random()*3-1.5}deg)`:"none",
    }}>
      <div className="scanlines" />
      {glitching && Array.from({length:20}).map((_,i) => (
        <div key={i} style={{position:"fixed",left:0,right:0,top:`${Math.random()*100}%`,height:`${1+Math.random()*5}px`,zIndex:200,background:[b.color,"#F2C744","#4ADE80","#E8DCC8","#8B5CF6","#FF1493"][Math.floor(Math.random()*6)],opacity:.8,animation:`gbar .15s ease ${Math.random()*.8}s forwards`}}/>
      ))}

      <div style={{position:"relative",zIndex:10,maxWidth:"400px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:".4rem",letterSpacing:".35em",textTransform:"uppercase",color:b.color,opacity:.5,marginBottom:".3rem"}}>{b.label}</div>
        {senderName && <p style={{fontSize:".48rem",color:"#E8DCC8",opacity:.2,marginBottom:"1.2rem"}}>with {senderName}</p>}

        <div style={{position:"relative",width:"160px",height:"160px",margin:"0 auto 1rem"}}>
          <svg viewBox="0 0 130 130" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
            <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(232,220,200,.04)" strokeWidth="3"/>
            <circle cx="65" cy="65" r={radius} fill="none" stroke={b.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={state==="ready"?circ:offset} style={{transition:"stroke-dashoffset 1s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:"1.5rem",marginBottom:".15rem"}}>{b.emoji}</span>
            <span style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"1.5rem",color:"#E8DCC8",letterSpacing:".05em"}}>
              {state==="ready"?`${Math.floor(totalDur/60)}:00`:`${m}:${s<10?'0':''}${s}`}
            </span>
          </div>
        </div>

        {state === "running" && (
          <div style={{minHeight:"65px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
            <span style={{fontSize:".33rem",letterSpacing:".3em",textTransform:"uppercase",color:b.color,opacity:.3,marginBottom:".4rem"}}>— Boby —</span>
            <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:"clamp(.68rem,1.6vw,.78rem)",lineHeight:1.7,color:"#E8DCC8",maxWidth:"340px",opacity:fading?0:.45,transition:"opacity .5s"}}>{b.thoughts[ti]}</p>
          </div>
        )}

        {state === "ready" && (
          <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:".65rem",color:"#E8DCC8",opacity:.3,marginBottom:"1rem",lineHeight:1.6}}>"{b.invite}"</p>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:".5rem",alignItems:"center",marginBottom:"1rem"}}>
          {state === "ready" && (
            <button onClick={startTimer} style={{fontFamily:"'Space Mono',monospace",fontSize:".6rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:b.color,color:"#fff",border:"none",padding:".8rem 2.5rem",cursor:"pointer",boxShadow:`0 4px 18px ${b.color}44`}}>
              Start
            </button>
          )}
          {state === "running" && (
            <div style={{display:"flex",gap:".4rem",flexWrap:"wrap",justifyContent:"center"}}>
              <button onClick={restart} className="ctrl-btn" style={{borderColor:`${b.color}44`,color:b.color}}>Restart</button>
              <button onClick={addFive} className="ctrl-btn" style={{background:`${b.color}15`,borderColor:`${b.color}44`,color:b.color}}>Give me 5 more</button>
              <button onClick={endEarly} className="ctrl-btn" style={{borderColor:"rgba(232,220,200,.12)",color:"#E8DCC8",opacity:.35}}>I'm done</button>
            </div>
          )}
        </div>

        <a href="https://thehumanglitchreport.com" target="_blank" rel="noopener" style={{fontFamily:"'Space Mono',monospace",fontSize:".35rem",letterSpacing:".2em",textTransform:"uppercase",color:"#E8DCC8",textDecoration:"none",opacity:.1}}>thehumanglitchreport.com</a>
      </div>
    </div>
  );
}
