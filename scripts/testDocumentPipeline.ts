import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { prisma } = await import("../lib/prisma");
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const text = `
        HTML es un lenguaje de marcado utilizado para estructurar
        el contenido de las páginas web.

        CSS permite definir estilos y presentación.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.

        El DOM representa la estructura del documento y permite
        modificar sus elementos.
    `;

    const result = await ingestDocument(
        1,
        text,
        {
            source: "dia7-test.pdf",
            subject: "Programación Web",
            page: 1,
        },
        120,
        20
    );

    console.log("DOCUMENTO:");
    console.log(result.document);

    console.log("\nCHUNKS CREADOS:");
    console.log(result.chunks);

    const documentWithChunks =
        await prisma.document.findUnique({
            where: {
                id: result.document.id,
            },
            include: {
                chunks: true,
            },
        });

    console.log("\nDOCUMENTO CON CHUNKS:");
    console.log(documentWithChunks);

    const chunksWithEmbedding =
        await prisma.$queryRawUnsafe<
            {
                id: number;
                documentId: number;
                embeddingExists: boolean;
            }[]
        >(
            `
            SELECT
                id,
                "documentId",
                embedding IS NOT NULL AS "embeddingExists"
            FROM "DocumentChunk"
            WHERE "documentId" = $1
            ORDER BY id
            `,
            result.document.id
        );

    console.log("\nEMBEDDINGS:");
    console.log(chunksWithEmbedding);
}

main()
    .catch(console.error)
    .finally(() => process.exit());