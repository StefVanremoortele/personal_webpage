#!/usr/bin/env bash
# Build the static export and publish it to tryptamine's nginx root.
#
# Run this from tryptamine itself, or from another machine with Node/npm, rsync,
# SSH access to stef@tryptamine, and sudo permission for the final nginx sync.

set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-stef@tryptamine}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/stefvanremoortele.be}"
STAGE_PATH="${STAGE_PATH:-/tmp/personal-webpage-out}"
NPM_INSTALL_LOG="${NPM_INSTALL_LOG:-/tmp/personal-webpage-npm-install.log}"

cd "$(dirname "$0")/.."

need_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

host_part() {
  printf "%s\n" "${DEPLOY_HOST##*@}"
}

is_local_deploy_host() {
  local host
  host="$(host_part)"

  case "$host" in
    localhost|127.0.0.1|::1)
      return 0
      ;;
  esac

  [ "$host" = "$(hostname -s 2>/dev/null)" ] && return 0
  [ "$host" = "$(hostname -f 2>/dev/null)" ] && return 0

  return 1
}

publish_staged_build() {
  sudo rsync -a --delete --chown=nginx:nginx "${STAGE_PATH}/" "${DEPLOY_PATH}/"
  if command -v restorecon >/dev/null 2>&1; then
    sudo restorecon -R "${DEPLOY_PATH}"
  elif [ -x /sbin/restorecon ]; then
    sudo /sbin/restorecon -R "${DEPLOY_PATH}"
  fi
  sudo nginx -t
  sudo systemctl reload nginx
  rm -rf "${STAGE_PATH}"
}

install_dependencies() {
  echo "Installing dependencies from package-lock.json"
  rm -f "${NPM_INSTALL_LOG}"

  if ! npm_config_jobs=1 npm_config_audit=false npm_config_fund=false npm ci --no-audit --no-fund 2>&1 | tee "${NPM_INSTALL_LOG}"; then
    if grep -q "ENOMEM\\|Cannot allocate memory" "${NPM_INSTALL_LOG}"; then
      cat >&2 <<EOF

npm ran out of memory while installing dependencies.

This server is small, so add swap and retry:
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

After a successful install, rerun with SKIP_INSTALL=1 to rebuild without reinstalling:
  SKIP_INSTALL=1 npm run deploy:tryptamine

Full npm log: ${NPM_INSTALL_LOG}
EOF
    fi
    exit 1
  fi
}

need_command node
need_command npm
need_command rsync
if ! is_local_deploy_host; then
  need_command ssh
fi

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

if is_local_deploy_host; then
  echo "Staging out/ locally at ${STAGE_PATH}"
  rsync -az --delete \
    --exclude=".DS_Store" \
    out/ "${STAGE_PATH}/"

  echo "Publishing staged build to ${DEPLOY_PATH}"
  publish_staged_build
else
  echo "Uploading out/ to ${DEPLOY_HOST}:${STAGE_PATH}"
  rsync -az --delete \
    --exclude=".DS_Store" \
    out/ "${DEPLOY_HOST}:${STAGE_PATH}/"

  echo "Publishing staged build to ${DEPLOY_PATH}"
  ssh "${DEPLOY_HOST}" "sudo rsync -a --delete --chown=nginx:nginx '${STAGE_PATH}/' '${DEPLOY_PATH}/' && if command -v restorecon >/dev/null 2>&1; then sudo restorecon -R '${DEPLOY_PATH}'; elif [ -x /sbin/restorecon ]; then sudo /sbin/restorecon -R '${DEPLOY_PATH}'; fi && sudo nginx -t && sudo systemctl reload nginx && rm -rf '${STAGE_PATH}'"
fi

echo "Published static export to ${DEPLOY_HOST}:${DEPLOY_PATH}"
