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

        CSS permite definir colores, fondos, tamaños, márgenes
        y otros estilos visuales de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.

        El DOM representa la estructura del documento y permite
        modificar sus elementos.
    `;

    const result = await ingestDocument(
        1,
        text,
        {
            source: "retrieval-test.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const questions = [
        {
            name: "RELEVANTE",
            text: "¿Cómo puedo cambiar el color de fondo de una página web?"
        },
        {
            name: "PARCIALMENTE RELEVANTE",
            text: "¿Qué es JavaScript?"
        },
        {
            name: "NO RELACIONADA",
            text: "¿Cuál es la capital de Francia?"
        }
    ];

    for (const question of questions) {
        const embedding = await createEmbedding(
            question.text
        );

        const chunks = await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 3,
                maxDistance: 0.6
            }
        );

        console.log(
            `\n=== ${question.name} ===`
        );

        console.log(
            "Pregunta:",
            question.text
        );

        console.log(
            "Resultados:",
            chunks
        );
    }

    console.log(
        "\nDOCUMENT ID:",
        result.document.id
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());