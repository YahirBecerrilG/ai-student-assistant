import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");

    await prisma.$executeRawUnsafe(
        `CREATE EXTENSION IF NOT EXISTS vector`
    );

    console.log("PGVECTOR HABILITADO");
}

main()
    .catch(console.error)
    .finally(() => process.exit());