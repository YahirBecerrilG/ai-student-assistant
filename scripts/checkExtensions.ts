import { prisma } from "../lib/prisma";

async function main() {
    const extensions = await prisma.$queryRawUnsafe<
        {
            extname: string;
            extversion: string;
        }[]
    >(`
        SELECT
            extname,
            extversion
        FROM pg_extension
        ORDER BY extname;
    `);

    console.table(extensions);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });