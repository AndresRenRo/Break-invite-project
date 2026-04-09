import { useState, useEffect, useRef } from "react";
import { BREAKS } from "./data";

function EndScreen({ b, endPhrase, onCreateNew }) {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState("idle"); // idle, loading, done, error

  const subscribe = async () => {
    if (!email || !email.includes("@")) return;
    setSubState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubState("done");
      } else {
        setSubState("error");
        setTimeout(() => setSubState("idle"), 3000);
      }
    } catch (e) {
      setSubState("error");
      setTimeout(() => setSubState("idle"), 3000);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace",padding:"2rem",position:"relative"}}>
      <div className="scanlines" />
      <div style={{textAlign:"center",maxWidth:"400px",animation:"fadeUp .8s ease",zIndex:10}}>
        {/* Decorative header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".8rem",marginBottom:"1.2rem",opacity:.2}}>
          <div style={{width:"30px",height:"1px",background:b.color}}/><span style={{fontSize:".8rem",color:b.color}}>✦</span><div style={{width:"30px",height:"1px",background:b.color}}/>
        </div>

        {/* Emoji + end phrase */}
        <div style={{fontSize:"3rem",marginBottom:".8rem"}}>{b.emoji}</div>
        <p style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"clamp(1.3rem,4.5vw,1.8rem)",fontWeight:700,color:b.color,lineHeight:1.5,marginBottom:".3rem",textShadow:`0 0 25px ${b.color}33`}}>{endPhrase}</p>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",margin:"1.2rem 0",opacity:.1}}>
          <div style={{width:"20px",height:"1px",background:"#E8DCC8"}}/><span style={{fontSize:".7rem",color:"#E8DCC8"}}>✦</span><div style={{width:"20px",height:"1px",background:"#E8DCC8"}}/>
        </div>

        {/* PRIMARY CTA: Invite someone else */}
        <button onClick={onCreateNew} style={{fontFamily:"'Space Mono',monospace",fontSize:".85rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",background:b.color,color:"#fff",border:"none",padding:".85rem 2rem",cursor:"pointer",width:"100%",marginBottom:"1.2rem",boxShadow:`0 4px 20px ${b.color}44`}}>
          Now invite someone else
        </button>

        {/* EMAIL CAPTURE */}
        <div style={{marginBottom:"1.2rem",padding:"1rem",background:"rgba(232,220,200,.03)",border:"1px solid rgba(232,220,200,.08)",borderRadius:"6px"}}>
          {subState === "done" ? (
            <div style={{padding:".5rem 0"}}>
              <p style={{fontSize:"1rem",color:"#4ADE80",fontWeight:700,marginBottom:".3rem"}}>You're in. 🤝</p>
              <p style={{fontSize:".75rem",color:"#E8DCC8",opacity:.4}}>Check your inbox. Welcome to the glitch.</p>
            </div>
          ) : (
            <>
              <p style={{fontSize:".8rem",color:"#E8DCC8",opacity:.45,marginBottom:".7rem",lineHeight:1.5}}>
                Want more useless tools and bad advice?
              </p>
              <div style={{display:"flex",gap:".4rem"}}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && subscribe()}
                  style={{
                    flex:1,fontFamily:"'Space Mono',monospace",fontSize:".85rem",
                    background:"rgba(232,220,200,.05)",border:"1px solid rgba(232,220,200,.12)",
                    color:"#E8DCC8",padding:".7rem .8rem",outline:"none",
                    borderRadius:"3px",
                  }}
                />
                <button
                  onClick={subscribe}
                  disabled={subState === "loading"}
                  style={{
                    fontFamily:"'Space Mono',monospace",fontSize:".75rem",fontWeight:700,
                    letterSpacing:".1em",textTransform:"uppercase",
                    background:subState === "error" ? "#D94032" : b.color,
                    color:"#fff",border:"none",padding:".7rem 1rem",
                    cursor:subState === "loading" ? "wait" : "pointer",
                    opacity:subState === "loading" ? .5 : 1,
                    whiteSpace:"nowrap",borderRadius:"3px",
                    transition:"all .25s",
                  }}
                >
                  {subState === "loading" ? "..." : subState === "error" ? "Retry" : "I'm in"}
                </button>
              </div>
              <p style={{fontSize:".6rem",color:"#E8DCC8",opacity:.15,marginTop:".4rem"}}>
                The Human Glitch Report — no spam, just glitches
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p style={{fontSize:".55rem",color:"#E8DCC8",opacity:.08}}>thehumanglitchreport.com</p>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

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
    <EndScreen b={b} endPhrase={endPhrase} onCreateNew={onCreateNew} />
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
        <div style={{fontSize:"1rem",letterSpacing:".35em",textTransform:"uppercase",color:b.color,opacity:.5,marginBottom:".3rem"}}>{b.label}</div>
        {senderName && <p style={{fontSize:".8rem",color:"#E8DCC8",opacity:.2,marginBottom:"1.2rem"}}>with {senderName}</p>}

        <div style={{position:"relative",width:"160px",height:"160px",margin:"0 auto 1rem"}}>
          <svg viewBox="0 0 130 130" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
            <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(232,220,200,.04)" strokeWidth="3"/>
            <circle cx="65" cy="65" r={radius} fill="none" stroke={b.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={state==="ready"?circ:offset} style={{transition:"stroke-dashoffset 1s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:"2rem",marginBottom:".2rem"}}>{b.emoji}</span>
            <span style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"2.2rem",color:"#E8DCC8",letterSpacing:".05em"}}>
              {state==="ready"?`${Math.floor(totalDur/60)}:00`:`${m}:${s<10?'0':''}${s}`}
            </span>
          </div>
        </div>

        {state === "running" && (
          <div style={{minHeight:"65px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
            <span style={{fontSize:".65rem",letterSpacing:".3em",textTransform:"uppercase",color:b.color,opacity:.3,marginBottom:".4rem"}}>— BREAK WISDOM —</span>
            <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:"clamp(.95rem,2.5vw,1.1rem)",lineHeight:1.7,color:"#E8DCC8",maxWidth:"340px",opacity:fading?0:.45,transition:"opacity .5s"}}>{b.thoughts[ti]}</p>
          </div>
        )}

        {state === "ready" && (
          <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:".95rem",color:"#E8DCC8",opacity:.3,marginBottom:"1rem",lineHeight:1.6}}>"{b.invite}"</p>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:".5rem",alignItems:"center",marginBottom:"1rem"}}>
          {state === "ready" && (
            <button onClick={startTimer} style={{fontFamily:"'Space Mono',monospace",fontSize:".9rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:b.color,color:"#fff",border:"none",padding:".8rem 2.5rem",cursor:"pointer",boxShadow:`0 4px 18px ${b.color}44`}}>
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

        <a href="https://thehumanglitchreport.com" target="_blank" rel="noopener" style={{fontFamily:"'Space Mono',monospace",fontSize:".95rem",letterSpacing:".2em",textTransform:"uppercase",color:"#E8DCC8",textDecoration:"none",opacity:.1}}>thehumanglitchreport.com</a>
      </div>
    </div>
  );
}
