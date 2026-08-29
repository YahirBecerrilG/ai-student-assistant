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

    const documents = [
        {
            name: "html.pdf",
            content:
                "HTML permite estructurar el contenido de las páginas web.",
        },
        {
            name: "css.pdf",
            content:
                "CSS permite modificar colores, fondos, tamaños y estilos visuales.",
        },
        {
            name: "javascript.pdf",
            content:
                "JavaScript permite agregar comportamiento e interactividad a las páginas web.",
        },
    ];

    const createdDocuments = [];

    for (const document of documents) {
        const result = await ingestDocument(
            1,
            document.content,
            {
                source: document.name,
                subject: "Programación Web",
            },
            120,
            20
        );

        createdDocuments.push({
            name: document.name,
            id: result.document.id,
        });
    }

    const testCases = [
        {
            question: "¿Qué tecnología estructura una página web?",
            expectedDocument: "html.pdf",
        },
        {
            question: "¿Cómo puedo cambiar el color de fondo?",
            expectedDocument: "css.pdf",
        },
        {
            question: "¿Qué permite agregar interactividad a una página web?",
            expectedDocument: "javascript.pdf",
        },
    ];

    let correct = 0;

    for (const test of testCases) {
        const embedding = await createEmbedding(
            test.question
        );

        const chunks = await retrieveRelevantChunks(
            1,
            embedding,
            {
                topK: 1,
                maxDistance: 0.6,
            }
        );

        const retrievedDocument =
            chunks[0]?.documentName;

        const passed =
            retrievedDocument === test.expectedDocument;

        if (passed) {
            correct++;
        }

        console.log("\nPregunta:");
        console.log(test.question);

        console.log(
            "Esperado:",
            test.expectedDocument
        );

        console.log(
            "Recuperado:",
            retrievedDocument ?? "NINGUNO"
        );

        console.log(
            "Resultado:",
            passed ? "PASS ✅" : "FAIL ❌"
        );

        if (chunks[0]) {
            console.log(
                "Distance:",
                chunks[0].distance
            );
        }
    }

    const total = testCases.length;
    const accuracy = (correct / total) * 100;

    console.log("\n==============================");
    console.log("EVALUACIÓN DEL RETRIEVAL");
    console.log("==============================");

    console.log(
        `Correctas: ${correct}/${total}`
    );

    console.log(
        `Accuracy: ${accuracy.toFixed(2)}%`
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());