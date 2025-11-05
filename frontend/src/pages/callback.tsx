import React, { useEffect, useState } from "react";

export default function Callback() {
  const [status, setStatus] = useState("Processing...");
  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (!code) { setStatus("Missing code parameter"); return; }

      try {
        // In a real app, exchange the code for tokens on a server.
        // For this demo, we simulate success and call the risk API with basic context.
        const res = await fetch(process.env.NEXT_PUBLIC_RISK_API_BASE || process.env.RISK_API_BASE + "/risk/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ip: "198.51.100.1",
            device_id: "new",
            user_agent: navigator.userAgent,
            geo: { country: "AU" },
            login_ts: Math.floor(Date.now()/1000)
          })
        });
        const json = await res.json();
        if (json.require_mfa) {
          setStatus("High risk → redirecting to MFA...");
          const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
          const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
          const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
          const mfaUrl = new URL(`https://${domain}/login`);
          mfaUrl.searchParams.set("client_id", clientId);
          mfaUrl.searchParams.set("redirect_uri", redirectUri);
          window.location.href = mfaUrl.toString();
        } else {
          setStatus("Risk OK → you can proceed to Profile.");
          window.location.href = "/profile";
        }
      } catch (e:any) {
        setStatus("Callback error: " + e.message);
      }
    })();
  }, []);
  return <main style={{padding:24}}><p>{status}</p></main>;
}
