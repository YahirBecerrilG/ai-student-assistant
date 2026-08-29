import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.SHADOW_DATABASE_URL;

if (!connectionString) {
    throw new Error("SHADOW_DATABASE_URL no está definida");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const result = await prisma.$queryRawUnsafe<
        {
            database: string;
            user: string;
            port: number;
        }[]
    >(`
        SELECT
            current_database() AS database,
            current_user AS "user",
            inet_server_port() AS port
    `);

    console.table(result);

    const extension = await prisma.$queryRawUnsafe<
        {
            extname: string;
        }[]
    >(`
        SELECT extname
        FROM pg_extension
        WHERE extname = 'vector'
    `);

    console.log("VECTOR EXTENSION:");
    console.table(extension);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });