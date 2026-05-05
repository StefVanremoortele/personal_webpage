# Deployment

Static site, served by nginx on a VPS.

## Build & sync

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

## TLS

`certbot --nginx -d stefvanremoortele.be -d www.stefvanremoortele.be` once after the DNS A/AAAA records are pointed at the VPS.

## Updating content

Edit `content/site.ts` (profile, experience, projects, skills) and re-run the deploy script.
