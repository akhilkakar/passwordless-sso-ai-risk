import React from "react";

export default function Protected({ children }:{children:React.ReactNode}) {
  // Placeholder wrapper; in real app verify ID token/JWT in cookies/session.
  return <>{children}</>;
}
