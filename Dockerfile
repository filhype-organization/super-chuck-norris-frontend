FROM arm64v8/caddy:2.9.1-alpine
LABEL authors="filhype.bernard@gmail.com"

COPY dist/front-chuck-norris/browser/* /srv
