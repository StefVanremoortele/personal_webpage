#!/usr/bin/env bash
# Build the static export and publish it to this server's nginx root.
#
# Run this on the web server itself. Needs Node 22+, npm, rsync, nginx and sudo.

set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/stefvanremoortele.be}"
WEB_USER="${WEB_USER:-www-data}"
NPM_INSTALL_LOG="${NPM_INSTALL_LOG:-/tmp/personal-webpage-npm-install.log}"

cd "$(dirname "$0")/.."

need_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

install_dependencies() {
  echo "Installing dependencies from package-lock.json"
  rm -f "${NPM_INSTALL_LOG}"

  if ! npm_config_jobs=1 npm_config_audit=false npm_config_fund=false npm ci --no-audit --no-fund 2>&1 | tee "${NPM_INSTALL_LOG}"; then
    if grep -q "ENOMEM\\|Cannot allocate memory" "${NPM_INSTALL_LOG}"; then
      echo "npm ran out of memory; give this server more RAM/swap and retry." >&2
      echo "Full npm log: ${NPM_INSTALL_LOG}" >&2
    fi
    exit 1
  fi
}

need_command node
need_command npm
need_command rsync

node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$node_major" -lt 22 ]; then
  echo "Node 22 or newer is required. Current version: $(node -v)" >&2
  exit 1
fi

if [ "${SKIP_INSTALL:-0}" != "1" ]; then
  install_dependencies
fi

echo "Building static export"
npm run build

echo "Publishing out/ to ${DEPLOY_PATH}"
sudo mkdir -p "${DEPLOY_PATH}"
sudo rsync -a --delete --exclude=".DS_Store" --chown="${WEB_USER}:${WEB_USER}" out/ "${DEPLOY_PATH}/"
if command -v restorecon >/dev/null 2>&1; then
  sudo restorecon -R "${DEPLOY_PATH}"
fi
sudo nginx -t
sudo systemctl reload nginx

echo "Published static export to ${DEPLOY_PATH}"
