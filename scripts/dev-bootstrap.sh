#!/usr/bin/env bash
set -euo pipefail

echo "Installing infra deps..."
pushd infra >/dev/null
npm i
popd >/dev/null

echo "Creating Python venv and installing backend deps..."
pushd backend >/dev/null
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
deactivate
popd >/dev/null

echo "Installing frontend deps..."
pushd frontend >/dev/null
npm i
popd >/dev/null

echo "Done. Next steps:"
echo "1) cdk bootstrap && cdk deploy IdentityStack DataStack"
echo "2) Start backend: uvicorn app:app --reload --port 8081"
echo "3) Start frontend: npm run dev"
