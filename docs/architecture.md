# Architecture Overview

```mermaid
flowchart LR
  User[User Browser] -->|Passkey (Cognito Hosted UI)| Cognito((Amazon Cognito))
  Cognito --> NextJS[Next.js App]
  NextJS -->|POST /risk/evaluate| RiskAPI[FastAPI Risk Engine]
  RiskAPI -->|Store outcome| DDB[(DynamoDB risk_events)]
```

See `high-level.mmd`, `auth-sequence.mmd`, and `data-flow.mmd` for more detail.
