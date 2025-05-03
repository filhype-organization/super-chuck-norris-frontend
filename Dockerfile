FROM caddy:alpine
LABEL authors="filhype.bernard@gmail.com"

COPY target/artifact/* /srv
COPY Caddyfile /etc/caddy/
