import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");

    const result = await prisma.documentChunk.deleteMany({
        where: {
            userId: 1,
        },
    });

    console.log(
        `Chunks eliminados: ${result.count}`
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());