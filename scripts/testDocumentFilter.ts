import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const { createEmbedding } = await import(
        "../lib/rag/createEmbedding"
    );

    const { retrieveRelevantChunks } = await import(
        "../lib/rag/retrieveRelevantChunks"
    );

    const documentA = await ingestDocument(
        1,
        `
        CSS permite cambiar colores, fondos y estilos visuales
        de una página web.
        `,
        {
            source: "documento-css.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const documentB = await ingestDocument(
        1,
        `
        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
        `,
        {
            source: "documento-javascript.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const question =
        "¿Cómo puedo cambiar los colores de una página web?";

    const embedding = await createEmbedding(question);

    console.log("\n=== SIN FILTRO DE DOCUMENTO ===");

    const allDocuments =
        await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 5,
                maxDistance: 0.6,
            }
        );

    console.log(allDocuments);

    console.log("\n=== FILTRO: DOCUMENTO CSS ===");

    const onlyCss =
        await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 5,
                maxDistance: 0.6,
                documentId: documentA.document.id,
            }
        );

    console.log(onlyCss);

    console.log("\n=== FILTRO: DOCUMENTO JAVASCRIPT ===");

    const onlyJavascript =
        await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 5,
                maxDistance: 0.6,
                documentId: documentB.document.id,
            }
        );

    console.log(onlyJavascript);

    console.log("\nDOCUMENTO CSS:", documentA.document.id);
    console.log(
        "DOCUMENTO JAVASCRIPT:",
        documentB.document.id
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());