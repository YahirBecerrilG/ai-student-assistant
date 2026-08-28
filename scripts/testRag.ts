import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const { answerWithContext } = await import(
        "../lib/rag/answerWithContext"
    );

    await ingestDocument(
        1,
        `
        HTML es un lenguaje de marcado utilizado para estructurar
        las páginas web.

        CSS permite cambiar colores, fondos y estilos visuales
        de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
        `,
        {
            source: "rag-context-test.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const result = await answerWithContext(
        1,
        "¿Qué lenguaje se utiliza para estructurar páginas web?"
    );

    console.log("RESPUESTA RAG:");
    console.log(result.answer);

    console.log("\nCHUNKS UTILIZADOS:");
    console.log(result.chunks);
}

main()
    .catch(console.error)
    .finally(() => process.exit());