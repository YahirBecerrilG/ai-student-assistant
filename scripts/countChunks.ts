import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");

    const count = await prisma.documentChunk.count({
        where: {
            userId: 1,
        },
    });

    console.log("TOTAL DE CHUNKS:", count);
}

main()
    .catch(console.error)
    .finally(() => process.exit());