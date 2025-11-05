# Passwordless SSO + AI Risk (AWS)

A demo that implements passwordless login with **Passkeys (WebAuthn/FIDO2) using Amazon Cognito** and an **adaptive risk-scoring engine** that enforces step-up MFA when risk is high. It ships with frontend, backend, infra (CDK), docs, and scripts.

> Built for local development first; deployable later with AWS CDK.

---

## Tech Stack
- **Frontend:** Next.js 14 (React 18, TypeScript)
- **Backend:** FastAPI (Python 3.11)
- **Infra:** AWS CDK (TypeScript)
- **AWS:** Cognito (Passkeys/MFA), DynamoDB, (optional) API Gateway/Lambda, EventBridge, S3/Athena/QuickSight
- **Tooling:** Node.js 20+, Python 3.11+, AWS CLI, AWS CDK

## Quick Start (Local)

1. **Prerequisites**
   - Node.js 20+
   - Python 3.11+
   - AWS CLI v2 and credentials configured
   - AWS CDK v2 (`npm i -g aws-cdk`)

2. **Deploy minimal infra (Cognito + DynamoDB)**
   ```bash
   cd infra
   npm i
   npx cdk bootstrap
   npx cdk deploy IdentityStack DataStack
   ```
   Capture outputs (UserPoolId, AppClientId, Domain, Region, DDB table).

3. **Run backend (FastAPI risk engine)**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8081
   ```

4. **Run frontend (Next.js)**
   ```bash
   cd frontend
   npm i
   npm run dev
   ```
   Open http://localhost:3000

## Flow

- `/login` → Cognito Hosted UI (Auth Code + PKCE, Passkeys enabled)
- `/callback` → exchange code; call **/risk/evaluate** with ID token + context
- If risk policy requires MFA → redirect to Cognito MFA
- `/profile` → show ID token claims and risk decision

## Environment Variables

- **frontend/.env.local**
  ```ini
  NEXT_PUBLIC_COGNITO_DOMAIN=your-domain.auth.ap-southeast-2.amazoncognito.com
  NEXT_PUBLIC_COGNITO_CLIENT_ID=your_app_client_id
  NEXT_PUBLIC_COGNITO_REDIRECT_URI=http://localhost:3000/callback
  NEXT_PUBLIC_COGNITO_LOGOUT_URI=http://localhost:3000/
  NEXT_PUBLIC_COGNITO_REGION=ap-southeast-2
  RISK_API_BASE=http://localhost:8081
  ```

- **backend/.env**
  ```ini
  COGNITO_USER_POOL_ID=ap-southeast-2_ABC123
  COGNITO_REGION=ap-southeast-2
  RISK_DDB_TABLE=risk_events
  ALLOW_BEDROCK=false
  ALLOW_SAGEMAKER=false
  ```

## Repo Structure

```
passwordless-sso-ai-risk/
├─ README.md
├─ LICENSE (MIT)
├─ .gitignore
├─ frontend/        # Next.js app
├─ backend/         # FastAPI risk engine
├─ infra/           # AWS CDK (TypeScript)
├─ docs/            # diagrams + ADRs + blog draft
└─ scripts/         # bootstrap + test
```

## Roadmap
- Add IP reputation & geo-IP feed
- Replace rules with ML (SageMaker/Bedrock inference)
- Hook EventBridge → S3 (Athena/QuickSight) for analytics

---

© 2025
