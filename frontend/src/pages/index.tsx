import React from "react";
import Link from "next/link";
import PasskeyButton from "../components/PasskeyButton";

export default function Home() {
  return (
    <main style={{padding: 24}}>
      <h1>Passwordless SSO + AI Risk</h1>
      <p>Login with Passkeys via Cognito Hosted UI. Adaptive MFA based on risk.</p>
      <div style={{display:'flex', gap:12}}>
        <Link href="/login">Go to Login</Link>
        <Link href="/profile">Profile</Link>
      </div>
      <div style={{marginTop: 24}}>
        <PasskeyButton />
      </div>
    </main>
  );
}
