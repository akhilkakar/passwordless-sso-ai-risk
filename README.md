# Passwordless SSO + AI Risk Scoring (AWS)

**Goal**: Demonstrate passwordless login with passkeys (WebAuthn/FIDO2) on AWS Cognito and an adaptive risk engine that triggers step-up MFA only when needed.

---

## Why this matters
- **Better UX**: Passkeys remove passwords (phishing-resistant, device-bound credentials)
- **Stronger security**: Adaptive MFA applies friction only for risky logins
- **Measurable value**: Lower account-takeover (ATO) risk, fewer helpdesk resets, higher conversion

---

## Architecture (at a glance)
![Architecture](./docs/diagrams/high-level.png)

**Core components**
- **Identity**: Amazon Cognito User Pools (Passkeys/WebAuthn). Alternative: AWS Identity Center (workforce)
- **Frontend**: Next.js demo app using Hosted UI or custom WebAuthn
- **Risk Engine API**: FastAPI on AWS Lambda + API Gateway
- **Data**: DynamoDB (risk_events, sessions)
- **Analytics (optional)**: EventBridge → S3/Athena/QuickSight dashboards
- **AI**: Rule-based baseline + optional anomaly detection (SageMaker RCF) and/or Bedrock (LLM signals)

---

## Demo flows
1. **Low-risk**: User clicks *Login with Passkey* → WebAuthn assertion → Cognito → ID token issued → Risk API returns *Low* → user lands on Profile.
2. **High-risk**: Same login, but unusual device/IP/velocity → Risk API returns *High* → app requires step-up MFA via Cognito challenge.

---

## Prerequisites
- **AWS Account** with Administrator permissions (required to deploy Cognito, Lambda, DynamoDB, etc.)
- Node.js 20+
- Python 3.11+
- AWS CLI installed & configured
- AWS CDK bootstrapped in your account
- (Optional) MaxMind GeoLite2 City DB for geo features

---

## Setup & Deployment

### 1. Infrastructure
```bash
cd infra && npm i && npx cdk bootstrap && npx cdk deploy --all
```

### 2. Backend
```bash
cd ../backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8081
```

### 3. Frontend
```bash
cd ../frontend
npm i
npm run dev
```

---

## Configure Cognito Passkeys
- Create a User Pool with **passwordless sign-in (Passkeys/WebAuthn)** enabled (or use custom challenge Lambdas).
- Create App Client (no secret), configure Hosted UI domain and allowed callback URLs.
- Enable MFA (TOTP or SMS) as **OPTIONAL** so app can trigger step-up when risk is high.

---

## Environment variables

### Frontend `.env.local`
```
NEXT_PUBLIC_COGNITO_DOMAIN=your-domain.auth.region.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
NEXT_PUBLIC_COGNITO_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_COGNITO_LOGOUT_URI=http://localhost:3000/
NEXT_PUBLIC_COGNITO_REGION=ap-southeast-2
```

### Backend `.env`
```
COGNITO_USER_POOL_ID=...
COGNITO_REGION=ap-southeast-2
RISK_DDB_TABLE=risk_events
ALLOW_BEDROCK=false
ALLOW_SAGEMAKER=false
```

---

## Risk policy (simplified)
- **Signals**: IP reputation, geo-velocity, device freshness, time-of-day, failed attempts, token age
- **Scoring**: Weighted rules → categorical outcome (Low/Med/High)
- **Step-up**: If `High`, return `require_mfa=true`, otherwise allow

---

## Screens
- **Landing**: Login with Passkey | Login with Password (fallback)
- **Profile**: Shows ID token claims, last login risk label, contributing signals
- **Admin (optional)**: QuickSight dashboard for risk trends

---

## Roadmap
- Add behavioral features (typing cadence, click rhythms)
- Integrate Amazon Bedrock Guardrails for policy hints
- Multi-IdP brokering via Amazon Cognito + OIDC/SAML identity providers

---

## License
MIT
