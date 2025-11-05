import React from "react";

export default function RiskBadge({ score, decision }:{score:number; decision:string}) {
  const color = decision === "HIGH" ? "crimson" : decision === "MEDIUM" ? "orange" : "seagreen";
  return (
    <div style={{border:`2px solid ${color}`, padding:8, display:'inline-block', borderRadius:8}}>
      Risk: <b>{decision}</b> ({score})
    </div>
  );
}
