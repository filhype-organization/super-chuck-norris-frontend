FROM arm64v8/caddy:2.9.1-alpine
LABEL authors="filhype.bernard@gmail.com"

COPY target/artifact/* /srv
COPY Caddyfile /etc/caddy/
