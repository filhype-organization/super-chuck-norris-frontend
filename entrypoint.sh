#!/bin/sh

cat <<EOF > /srv/browser/ngx-env.js
globalThis._NGX_ENV_ = {
  NG_APP_API_URL: "${NG_APP_API_URL}",
  NG_APP_AUTH_URL: "${NG_APP_AUTH_URL}",
  NG_APP_CLIENT_ID: "${NG_APP_CLIENT_ID}",
};
EOF

# Lancer Caddy pour servir les fichiers statiques
caddy run --config /etc/caddy/Caddyfile
