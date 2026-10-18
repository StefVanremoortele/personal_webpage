# Deployment

Static site, built and served by nginx on the server where this repo is checked out.

## Build & publish

On the web server:

```bash
cd ~/personal_webpage
git pull
npm run deploy
```

The script (`scripts/publish.sh`) installs from `package-lock.json`, builds the static export, publishes `out/` to `/var/www/stefvanremoortele.be`, tests nginx, and reloads nginx.

If dependencies are already installed and you only changed source files:

```bash
SKIP_INSTALL=1 npm run deploy
```

Overrides: `DEPLOY_PATH` (default `/var/www/stefvanremoortele.be`), `WEB_USER` (default `www-data`).

Requirements: Node 22+, npm, rsync, nginx, sudo. If `npm ci` fails with `ENOMEM`, give the server more RAM or swap.

## nginx

Site config (`/etc/nginx/sites-available/personal-webpage`, Debian layout):

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name stefvanremoortele.be www.stefvanremoortele.be vanremoortele.be www.vanremoortele.be _;

  root /var/www/stefvanremoortele.be;
  index index.html;

  # Static export emits a file per route — try the exact path, then .html, then 404.
  location / {
    try_files $uri $uri.html $uri/index.html =404;
  }

  # Long cache for hashed static assets, short cache for HTML.
  location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  location ~* \.html$ {
    expires 5m;
    add_header Cache-Control "public, must-revalidate";
  }

  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}
```

TLS is terminated by the gateway in front of this server, so nginx here listens on plain HTTP.

## Docker

The repository includes a production Docker image that builds the static export and serves it with nginx:

```bash
docker build -t personal-webpage .
docker run -d --name personal-webpage --restart unless-stopped -p 8080:80 personal-webpage
```

For local/containerized deployment, Compose maps host port `3000` to container port `80`:

```bash
docker compose up -d --build
```

## Updating content

Edit `content/site.ts` (profile, experience, projects, skills) and re-run `npm run deploy`.
