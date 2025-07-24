FROM caddy:alpine

COPY target/artifact/* /srv
COPY Caddyfile /etc/caddy/

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]