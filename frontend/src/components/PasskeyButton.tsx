import React from "react";

export default function PasskeyButton() {
  return (
    <button onClick={() => alert("Passkey flow handled by Cognito Hosted UI in this demo.")}>
      Login with Passkey
    </button>
  );
}
