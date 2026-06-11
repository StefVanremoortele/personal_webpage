# Deployment

Static site, served by nginx on a VPS.

## Build & publish on tryptamine

On tryptamine:

```bash
cd /home/stef/projects/personal_webpage
npm run deploy:tryptamine
```

The script installs from `package-lock.json`, builds the static export, publishes `out/` to `/var/www/stefvanremoortele.be`, restores SELinux labels, tests nginx, and reloads nginx.

If dependencies are already installed and you only changed source files:

```bash
SKIP_INSTALL=1 npm run deploy:tryptamine
```

tryptamine is a small VPS. If `npm ci` fails with `spawn ENOMEM`, add swap and retry:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Build & sync from another machine

```bash
DEPLOY_HOST=stef@my.vps DEPLOY_PATH=/var/www/stefvanremoortele.be ./scripts/deploy.sh
```

The script runs `npm run build`, then rsyncs `out/` to the remote path with `--delete`.

## nginx snippet

```nginx
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name stefvanremoortele.be www.stefvanremoortele.be;

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
  # Brotli optional — requires nginx-mod-brotli.

  ssl_certificate     /etc/letsencrypt/live/stefvanremoortele.be/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/stefvanremoortele.be/privkey.pem;
}

server {
  listen 80;
  listen [::]:80;
  server_name stefvanremoortele.be www.stefvanremoortele.be;
  return 301 https://stefvanremoortele.be$request_uri;
}
```

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

If putting this behind a host nginx reverse proxy, proxy to the mapped host port and keep TLS termination on the host.

## TLS

`certbot --nginx -d stefvanremoortele.be -d www.stefvanremoortele.be` once after the DNS A/AAAA records are pointed at the VPS.

## Updating content

Edit `content/site.ts` (profile, experience, projects, skills) and re-run the deploy script.
