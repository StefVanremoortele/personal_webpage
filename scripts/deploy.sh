#!/usr/bin/env bash
# Build the static site and rsync it to the VPS.
# Configure the destination via env vars or override the defaults below.
#
#   DEPLOY_HOST   — ssh host alias or user@host
#   DEPLOY_PATH   — absolute path on the remote, served by nginx
#
# Usage:
#   DEPLOY_HOST=stef@my.vps DEPLOY_PATH=/var/www/stefvanremoortele.be ./scripts/deploy.sh

set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-stef@vps}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/stefvanremoortele.be}"

cd "$(dirname "$0")/.."

echo "→ Building static export"
npm run build

echo "→ Syncing out/ to ${DEPLOY_HOST}:${DEPLOY_PATH}"
rsync -avz --delete \
  --exclude=".DS_Store" \
  out/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓ Deployed to ${DEPLOY_HOST}:${DEPLOY_PATH}"
