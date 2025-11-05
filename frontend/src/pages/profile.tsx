import React from "react";
import RiskBadge from "../components/RiskBadge";

export default function Profile() {
  // In a real app, decode ID token claims; here we stub.
  const claims = { sub: "123", email: "akhil@example.com", name: "Akhil" };
  const risk = { score: 18, decision: "LOW" };

  return (
    <main style={{padding:24}}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(claims, null, 2)}</pre>
      <RiskBadge score={risk.score} decision={risk.decision} />
    </main>
  );
}
