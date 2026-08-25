import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");

    const result = await prisma.$queryRaw<
        { extname: string }[]
    >`
        SELECT extname
        FROM pg_extension
        WHERE extname = 'vector';
    `;

    console.log("PGVECTOR:");
    console.log(result);
}

main()
    .catch(console.error)
    .finally(() => process.exit());