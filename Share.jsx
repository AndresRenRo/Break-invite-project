import { useState } from "react";
import { BREAKS } from "./data";

export default function Share({ url, breakType }) {
  const [copied, setCopied] = useState(false);
  const b = BREAKS[breakType] || BREAKS.smoke;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback for mobile
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono',monospace",padding:"2rem"}}>
      <div style={{maxWidth:"380px",width:"100%",textAlign:"center",zIndex:10}}>
        <div style={{fontSize:".4rem",letterSpacing:".35em",textTransform:"uppercase",color:b.color,opacity:.5,marginBottom:"1rem"}}>{b.label} Invite Ready</div>
        <div style={{fontSize:"2.8rem",marginBottom:".7rem"}}>{b.emoji}</div>
        <p style={{fontFamily:"'Georgia',serif",fontStyle:"italic",fontSize:".65rem",color:"#E8DCC8",opacity:.35,marginBottom:"1rem",lineHeight:1.6}}>
          The invite is sealed. Send this link.<br/>Don't explain it. Let Boby handle the rest.
        </p>
        <div style={{background:"rgba(232,220,200,.03)",border:"1px solid rgba(232,220,200,.08)",padding:".55rem .7rem",fontSize:".38rem",color:"#E8DCC8",opacity:.4,wordBreak:"break-all",lineHeight:1.5,marginBottom:".7rem",borderRadius:"3px"}}>{url}</div>
        <button onClick={copy} style={{fontFamily:"'Space Mono',monospace",fontSize:".55rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",background:copied?"#4ADE80":b.color,color:copied?"#0a0a0a":"#fff",border:"none",padding:".75rem 2rem",cursor:"pointer",width:"100%",transition:"all .3s",boxShadow:`0 4px 15px ${b.color}33`}}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
