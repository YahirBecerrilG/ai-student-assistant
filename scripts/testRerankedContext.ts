import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const { retrieveContext } = await import(
        "../lib/rag/retrieveContext"
    );

    const document = await ingestDocument(
        1,
        `
        HTML permite estructurar el contenido de las páginas web.

        CSS permite modificar colores, fondos, tamaños, márgenes
        y otros estilos visuales de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.

        El DOM representa la estructura del documento y permite
        modificar sus elementos.
        `,
        {
            source: "reranked-context-test.pdf",
            subject: "Programación Web",
        },
        100,
        20
    );

    const question =
        "¿Cómo puedo cambiar el color de fondo de una página web?";

    const result = await retrieveContext(
        1,
        question,
        {
            topK: 2,
            maxDistance: 0.6,
        }
    );

    console.log("PREGUNTA:");
    console.log(question);

    console.log("\nCHUNKS FINALES:");
    console.log(result.chunks);

    console.log("\nTOTAL DE CHUNKS FINALES:");
    console.log(result.chunks.length);

    console.log("\nCONTEXTO:");
    console.log(result.context);

    console.log(
        "\nDOCUMENTO DE PRUEBA:",
        document.document.id
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());