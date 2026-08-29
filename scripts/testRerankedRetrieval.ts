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

    const { rerankChunks } = await import(
        "../lib/rag/rerankChunks"
    );

    await ingestDocument(
        1,
        "JavaScript permite agregar comportamiento e interactividad a las páginas web.",
        {
            source: "javascript-rerank.pdf",
            subject: "Programación Web",
        }
    );

    await ingestDocument(
        1,
        "CSS permite cambiar colores, fondos, tamaños y estilos visuales de una página web.",
        {
            source: "css-rerank.pdf",
            subject: "Programación Web",
        }
    );

    await ingestDocument(
        1,
        "HTML permite estructurar el contenido de las páginas web.",
        {
            source: "html-rerank.pdf",
            subject: "Programación Web",
        }
    );

    const question =
        "¿Cómo puedo cambiar el color de fondo de una página web?";

    const embedding = await createEmbedding(question);

    const chunks = await retrieveRelevantChunks(
        1,
        embedding,
        {
            topK: 6,
            maxDistance: 0.6,
        }
    );

    const reranked = rerankChunks(
        chunks,
        question,
        3
    );

    console.log("PREGUNTA:");
    console.log(question);

    console.log("\nCANDIDATOS RECUPERADOS:");
    console.log(
        chunks.map((chunk) => ({
            documentName: chunk.documentName,
            distance: chunk.distance,
            similarity: chunk.similarity,
        }))
    );

    console.log("\nRESULTADOS RERANKEADOS:");

    console.log(
        reranked.map((chunk) => ({
            documentName: chunk.documentName,
            distance: chunk.distance,
            similarity: chunk.similarity,
            keywordScore: chunk.keywordScore,
            finalScore: chunk.finalScore,
        }))
    );

    console.log("\nPRIMER RESULTADO:");

    console.log(
        reranked[0]?.documentName ?? "NINGUNO"
    );
}

main()
    .catch(console.error)
    .finally(() => process.exit());