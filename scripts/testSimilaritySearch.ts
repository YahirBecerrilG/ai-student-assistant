import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");
    const { createEmbedding } = await import(
        "../lib/rag/createEmbedding"
    );

    const question =
        "¿Qué lenguaje se utiliza para estructurar páginas web?";

    const queryEmbedding = await createEmbedding(question);

    const vector = `[${queryEmbedding.join(",")}]`;

    const results = await prisma.$queryRawUnsafe<
        {
            id: number;
            content: string;
            distance: number;
        }[]
    >(
        `
        SELECT
            id,
            content,
            embedding <=> $1::vector AS distance
        FROM "DocumentChunk"
        WHERE "userId" = $2
          AND embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector
        LIMIT 5
        `,
        vector,
        1
    );

    console.log("SIMILARITY SEARCH:");
    console.log(results);
}

main()
    .catch(console.error)
    .finally(() => process.exit());