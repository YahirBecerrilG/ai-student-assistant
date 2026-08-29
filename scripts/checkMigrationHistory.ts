import { prisma } from "../lib/prisma";

async function main() {
    const migrations = await prisma.$queryRawUnsafe<
        {
            migration_name: string;
            checksum: string;
            finished_at: Date | null;
        }[]
    >(
        `
        SELECT
            migration_name,
            checksum,
            finished_at
        FROM "_prisma_migrations"
        ORDER BY started_at;
        `
    );

    console.table(migrations);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });