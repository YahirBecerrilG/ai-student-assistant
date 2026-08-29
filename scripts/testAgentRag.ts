import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { ingestDocument } = await import(
        "../lib/rag/ingestDocument"
    );

    await ingestDocument(
        1,
        `
        HTML permite estructurar el contenido de las páginas web.

        CSS permite cambiar colores, fondos y estilos visuales
        de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
        `,
        {
            source: "agent-rag-test.pdf",
            subject: "Programación Web",
        }
    );

    console.log("DOCUMENTO DE PRUEBA CREADO.");
}

main()
    .catch(console.error)
    .finally(() => process.exit());