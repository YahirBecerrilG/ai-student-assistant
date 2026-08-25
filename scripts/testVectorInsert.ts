import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");
    const { createEmbedding } = await import(
        "../lib/rag/createEmbedding"
    );

    const content =
        "HTML es un lenguaje de marcado utilizado para estructurar el contenido de las páginas web.";

    const embedding = await createEmbedding(content);

    const vector = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
        `
        UPDATE "DocumentChunk"
        SET embedding = $1::vector
        WHERE id = 1
        `,
        vector
    );

    console.log("EMBEDDING GUARDADO");
    console.log("Dimensiones:", embedding.length);
}

main()
    .catch(console.error)
    .finally(() => process.exit());