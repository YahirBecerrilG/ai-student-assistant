// lib/check-env.ts

import "dotenv/config";

const url = process.env.DATABASE_URL;

if (!url) {
    console.log("DATABASE_URL no definida");
    process.exit(1);
}

const parsed = new URL(url);

console.log({
    protocol: parsed.protocol,
    host: parsed.hostname,
    port: parsed.port,
    database: parsed.pathname,
    username: parsed.username,
});