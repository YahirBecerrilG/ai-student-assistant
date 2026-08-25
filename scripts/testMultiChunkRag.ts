import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    const { answerWithContext } = await import(
        "../lib/rag/answerWithContext"
    );

    const text = `
        HTML es un lenguaje de marcado utilizado para estructurar
        páginas web. Permite definir títulos, párrafos, enlaces,
        imágenes, listas y otros elementos de una página.

        CSS es un lenguaje utilizado para definir la presentación
        visual de una página web. Permite cambiar colores,
        fondos, tamaños, márgenes, posiciones y otros estilos.

        JavaScript es un lenguaje de programación utilizado para
        agregar comportamiento e interactividad a las páginas web.
        Permite responder a eventos, modificar elementos del DOM
        y ejecutar lógica en el navegador.
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

    const result = await answerWithContext(
        1,
        "¿Cómo puedo cambiar el color de fondo de una página web?"
    );

    console.log("RESPUESTA:");
    console.log(result.answer);

    console.log("\nCHUNKS RECUPERADOS:");
    console.log(result.chunks);
}

main()
    .catch(console.error)
    .finally(() => process.exit());