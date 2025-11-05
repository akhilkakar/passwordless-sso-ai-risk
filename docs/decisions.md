# Architectural Decisions (Highlights)

1. **Passkeys via Cognito Hosted UI** — offload WebAuthn complexity to Cognito.
2. **Rules first, ML later** — ship value fast; keep hooks for models.
3. **Serverless-first data** — DynamoDB for append-only risk events.
