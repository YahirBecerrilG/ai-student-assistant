import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
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
            source: "guia-programacion-web.pdf",
            subject: "Programación Web",
            page: 1,
        }
    );

    console.log("DOCUMENTO CREADO:");
    console.log(result.document);

    console.log("\nCHUNKS CREADOS:");
    console.log(result.chunks);
}

main()
    .catch(console.error)
    .finally(() => process.exit());