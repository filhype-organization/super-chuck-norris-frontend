#!/usr/bin/env node
// Generates public/ngx-env.js from .env for local dev (ng serve).
// In Docker, entrypoint.sh overwrites this file with real env vars.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'public', 'ngx-env.js');

const env = {};

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
    });
}

const content = `globalThis._NGX_ENV_ = ${JSON.stringify(env, null, 2)};\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log(`✅  public/ngx-env.js generated from .env`);
