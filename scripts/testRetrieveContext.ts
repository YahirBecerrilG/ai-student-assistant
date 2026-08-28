import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const { retrieveContext } = await import(
        "../lib/rag/retrieveContext"
    );

    const text = `
        HTML es un lenguaje de marcado utilizado para estructurar
        el contenido de las páginas web.

        CSS permite cambiar colores, fondos, tamaños y otros estilos
        visuales de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
    `;

    const document = await ingestDocument(
        1,
        text,
        {
            source: "retrieve-context-test.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const question =
        "¿Cómo puedo cambiar el color de fondo de una página web?";

    const result = await retrieveContext(
        1,
        question,
        {
            topK: 3,
            maxDistance: 0.6,
        }
    );

    console.log("PREGUNTA:");
    console.log(question);

    console.log("\nCHUNKS RECUPERADOS:");
    console.log(result.chunks);

    console.log("\nCONTEXTO PARA EL LLM:");
    console.log(result.context);

    console.log(
        "\nDOCUMENTO DE PRUEBA:",
        document.document.id
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());