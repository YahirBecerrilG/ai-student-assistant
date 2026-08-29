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
        HTML permite estructurar el contenido de las páginas web.

        CSS permite cambiar colores, fondos y estilos visuales
        de una página web.

        JavaScript permite agregar comportamiento e interactividad
        a las páginas web.
        `,
        {
            source: "rag-evaluation.pdf",
            subject: "Programación Web",
        },
        120,
        20
    );

    const testCases = [
        {
            question:
                "¿Qué tecnología permite cambiar el color de fondo de una página web?",
            expected: "answer",
        },
        {
            question:
                "¿Qué tecnología se utiliza para crear bases de datos relacionales?",
            expected: "no-answer",
        },
        {
            question:
                "¿Cuál es la capital de Francia?",
            expected: "no-answer",
        },
    ];

    let passed = 0;

    for (const test of testCases) {
        const result = await answerWithContext(
            1,
            test.question
        );

        const hasChunks =
            result.chunks.length > 0;

        const success =
            test.expected === "answer"
                ? hasChunks
                : !hasChunks;

        if (success) {
            passed++;
        }

        console.log("\n==============================");
        console.log("PREGUNTA:");
        console.log(test.question);

        console.log("\nCHUNKS:");
        console.log(result.chunks.length);

        console.log("\nRESPUESTA:");
        console.log(result.answer);

        console.log(
            "\nRESULTADO:",
            success ? "PASS ✅" : "FAIL ❌"
        );
    }

    console.log("\n==============================");
    console.log("EVALUACIÓN RAG");
    console.log("==============================");

    console.log(
        `Correctas: ${passed}/${testCases.length}`
    );

    console.log(
        `Accuracy: ${(
            (passed / testCases.length) *
            100
        ).toFixed(2)}%`
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());