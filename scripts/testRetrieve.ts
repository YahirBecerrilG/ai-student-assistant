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

    const text = `
        HTML es un lenguaje de marcado utilizado para estructurar
        el contenido de las páginas web.

        CSS permite definir estilos y presentación.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
    `;

    await ingestDocument(
        1,
        text,
        {
            source: "guia-programacion-web.pdf",
            subject: "Programación Web",
        },
        30,
        5
    );

    const question =
        "¿Qué tecnología permite cambiar los colores y fondos de una página web?";

    const embedding = await createEmbedding(question);

    const chunks = await retrieveRelevantChunks(
        1,
        embedding,
        {
            topK: 5
        }
    );

    console.log("CHUNKS RECUPERADOS:");
    console.log(chunks);
}

main()
    .catch(console.error)
    .finally(() => process.exit());