import { useState, useEffect } from "react";
import { getInviteFromURL } from "./storage";
import Creator from "./Creator";
import Share from "./Share";
import Envelope from "./Envelope";
import Timer from "./Timer";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [inviteData, setInviteData] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [shareType, setShareType] = useState("");
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const data = getInviteFromURL();
    if (data) {
      setInviteData(data);
      setScreen("receive");
    } else {
      setScreen("create");
    }
  }, []);

  const handleShare = (url, type) => {
    setShareUrl(url);
    setShareType(type);
    setScreen("share");
  };

  const goToCreate = () => {
    // Clear URL params
    window.history.replaceState({}, "", window.location.pathname);
    setTimerActive(false);
    setInviteData(null);
    setScreen("create");
  };

  if (screen === "loading") {
    return (
      <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <p style={{color:"#E8DCC8",opacity:.2,fontSize:".5rem",letterSpacing:".2em",fontFamily:"'Space Mono',monospace"}}>Loading...</p>
      </div>
    );
  }

  if (screen === "create") return <Creator onShare={handleShare} />;
  if (screen === "share") return <Share url={shareUrl} breakType={shareType} />;

  if (screen === "receive" && !timerActive) {
    return (
      <Envelope
        senderName={inviteData?.sender || "A friend"}
        breakType={inviteData?.type || "smoke"}
        duration={inviteData?.duration || 300}
        onOpen={() => setTimerActive(true)}
      />
    );
  }

  if (screen === "receive" && timerActive) {
    return (
      <Timer
        breakType={inviteData?.type || "smoke"}
        senderName={inviteData?.sender || "A friend"}
        duration={inviteData?.duration || 300}
        onCreateNew={goToCreate}
      />
    );
  }

  return null;
}
