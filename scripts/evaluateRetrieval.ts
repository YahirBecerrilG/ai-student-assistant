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

    await ingestDocument(
        1,
        `
        HTML permite estructurar el contenido de las páginas web.

        CSS permite modificar colores, fondos, tamaños, márgenes
        y otros estilos visuales.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
        `,
        {
            source: "evaluation-test.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const testCases = [
        {
            question: "¿Qué tecnología permite cambiar colores y fondos?",
            shouldFind: true,
        },
        {
            question: "¿Qué lenguaje agrega interactividad a una página web?",
            shouldFind: true,
        },
        {
            question: "¿Cuál es la capital de Francia?",
            shouldFind: false,
        },
        {
            question: "¿Qué es un perro?",
            shouldFind: false,
        },
    ];

    let passed = 0;

    for (const test of testCases) {
        const embedding = await createEmbedding(
            test.question
        );

        const chunks = await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 3,
                maxDistance: 0.6,
            }
        );

        const found = chunks.length > 0;
        const success = found === test.shouldFind;

        if (success) {
            passed++;
        }

        console.log("\nPregunta:", test.question);
        console.log("Esperado:", test.shouldFind);
        console.log("Encontrado:", found);
        console.log(
            "Resultado:",
            success ? "PASS ✅" : "FAIL ❌"
        );

        if (chunks.length > 0) {
            console.log(
                "Mejor distance:",
                chunks[0].distance
            );
        }
    }

    console.log(
        `\nEVALUACIÓN: ${passed}/${testCases.length} pruebas correctas`
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());