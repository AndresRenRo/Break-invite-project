import { useState } from "react";
import { BREAKS } from "./data";

export default function Envelope({ senderName, breakType, duration, onOpen }) {
  const [phase, setPhase] = useState("sealed");
  const b = BREAKS[breakType] || BREAKS.smoke;
  const mins = Math.floor(duration / 60);

  const handleTap = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setTimeout(() => setPhase("revealed"), 900);
  };

  return (
    <div onClick={phase === "sealed" ? handleTap : undefined} style={{
      minHeight:"100vh", background:"#0a0a0a", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", fontFamily:"'Space Mono',monospace",
      padding:"1.5rem", cursor:phase==="sealed"?"pointer":"default", position:"relative", overflow:"hidden",
    }}>
      <div className="scanlines" />
      <div className="vignette" />

      {phase === "sealed" && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",animation:"fadeUp .8s ease forwards",zIndex:10 }}>
          <div style={{fontSize:".75rem",letterSpacing:".4em",textTransform:"uppercase",color:"#F2C744",opacity:.4}}>You've received a Break Invite</div>
          <svg viewBox="0 0 220 170" style={{width:"240px",height:"185px",filter:"drop-shadow(0 8px 25px rgba(0,0,0,.4))"}}>
            <rect x="20" y="45" width="180" height="115" rx="4" fill="#2A2218" stroke="#4A3D2E" strokeWidth="1.2"/>
            <path d="M20 45 L110 100 L200 45" fill="#332B1F" stroke="#4A3D2E" strokeWidth=".5"/>
            <path d="M20 45 L110 5 L200 45Z" fill="#3D3425" stroke="#4A3D2E" strokeWidth="1.2"><animate attributeName="opacity" values="1;.92;1" dur="3s" repeatCount="indefinite"/></path>
            <circle cx="110" cy="45" r="15" fill={b.color}><animate attributeName="r" values="15;16;15" dur="2.5s" repeatCount="indefinite"/></circle>
            <text x="110" y="51" textAnchor="middle" fontSize="16">{b.emoji}</text>
            <circle cx="110" cy="45" r="22" fill={b.color} opacity=".08"><animate attributeName="r" values="22;28;22" dur="2.5s" repeatCount="indefinite"/></circle>
          </svg>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".3rem"}}>
            <p style={{fontSize:".95rem",color:"#E8DCC8",opacity:.5}}>From <span style={{color:b.color,fontWeight:700}}>{senderName}</span></p>
            <p style={{fontSize:".85rem",color:"#E8DCC8",opacity:.25,animation:"tapPulse 2s ease-in-out infinite"}}>Tap to open</p>
          </div>
        </div>
      )}

      {phase === "opening" && (
        <div style={{animation:"envelopeOut .9s ease forwards",zIndex:10}}>
          <svg viewBox="0 0 220 170" style={{width:"240px"}}>
            <rect x="20" y="45" width="180" height="115" rx="4" fill="#2A2218" stroke="#4A3D2E" strokeWidth="1.2"/>
            <path d="M20 45 L110 100 L200 45" fill="#332B1F"/>
            <rect x="35" y="40" width="150" height="90" rx="3" fill="#E8DCC8" opacity=".12"><animate attributeName="y" values="50;20" dur=".8s" fill="freeze"/></rect>
            <path d="M20 45 L110 5 L200 45Z" fill="#3D3425" stroke="#4A3D2E" strokeWidth="1" style={{transformOrigin:"110px 45px",animation:"flapUp .8s ease forwards"}}/>
          </svg>
        </div>
      )}

      {phase === "revealed" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",maxWidth:"380px",width:"100%",animation:"cardUp .6s cubic-bezier(.16,1,.3,1) forwards",zIndex:10}}>
          <div style={{background:`linear-gradient(180deg,${b.bg},#0a0a0a)`,border:`1px solid ${b.color}33`,borderRadius:"8px",padding:"2rem 1.5rem",width:"100%",textAlign:"center",position:"relative",boxShadow:`0 12px 40px rgba(0,0,0,.5)`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",marginBottom:"1rem",opacity:.15}}>
              <div style={{width:"25px",height:"1px",background:b.color}}/><span style={{fontSize:".95rem",letterSpacing:".3em",textTransform:"uppercase",color:b.color}}>Break Invite</span><div style={{width:"25px",height:"1px",background:b.color}}/>
            </div>
            <div style={{fontSize:"4rem",marginBottom:".6rem",animation:"bounceIn .5s ease .2s both"}}>{b.emoji}</div>
            <p style={{fontSize:".95rem",color:"#E8DCC8",opacity:.45,marginBottom:".3rem",animation:"fadeUp .5s ease .4s both"}}>
              <span style={{fontWeight:700,color:b.color}}>{senderName}</span> has invited you to a
            </p>
            <h1 style={{fontFamily:"'Playfair Display','Georgia',serif",fontSize:"clamp(1.8rem,6vw,2.5rem)",color:"#E8DCC8",marginBottom:".3rem",textShadow:`0 0 20px ${b.color}33`,animation:"fadeUp .5s ease .5s both"}}>{b.label}</h1>
            <p style={{fontSize:".8rem",color:b.color,opacity:.5,marginBottom:".8rem",animation:"fadeUp .5s ease .55s both"}}>{mins} minutes</p>
            <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:"1rem",lineHeight:1.6,color:"#E8DCC8",opacity:.45,marginBottom:"1.3rem",animation:"fadeUp .5s ease .6s both"}}>"{b.invite}"</p>
            <button onClick={onOpen} style={{fontFamily:"'Space Mono',monospace",fontSize:".85rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:b.color,color:"#fff",border:"none",padding:".85rem 2.2rem",cursor:"pointer",boxShadow:`0 4px 20px ${b.color}44`,animation:"fadeUp .5s ease .7s both"}}>Accept the invitation</button>
          </div>
        </div>
      )}
    </div>
  );
}
