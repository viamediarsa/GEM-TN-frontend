# Node 20 is EOL for CVE-2026-111497 — use a patched Node line and refresh libbrotli1.
FROM node:22.23.4-bookworm-slim

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends --only-upgrade libbrotli1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
