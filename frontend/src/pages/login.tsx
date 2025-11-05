import React, { useMemo } from "react";

const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!;
const region = process.env.NEXT_PUBLIC_COGNITO_REGION!;

export default function Login() {
  const authUrl = useMemo(() => {
    const url = new URL(`https://${domain}/oauth2/authorize`);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("state", "demo");
    url.searchParams.set("code_challenge_method", "S256");
    // For demo simplicity, we omit generating a real PKCE challenge here.
    url.searchParams.set("code_challenge", "demo-pkce-placeholder");
    return url.toString();
  }, []);

  return (
    <main style={{padding:24}}>
      <h2>Login</h2>
      <a href={authUrl}>Continue to Cognito Hosted UI</a>
      <p style={{marginTop:12}}>Passkeys must be enabled in the Cognito User Pool.</p>
    </main>
  );
}
