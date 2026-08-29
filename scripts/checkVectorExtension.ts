import { prisma } from "../lib/prisma";

async function main() {
    const result = await prisma.$queryRawUnsafe<
        {
            extname: string;
            extversion: string;
            extnamespace: string;
        }[]
    >(`
        SELECT
            e.extname,
            e.extversion,
            n.nspname AS extnamespace
        FROM pg_extension e
        INNER JOIN pg_namespace n
            ON n.oid = e.extnamespace
        WHERE e.extname = 'vector';
    `);

    console.table(result);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });