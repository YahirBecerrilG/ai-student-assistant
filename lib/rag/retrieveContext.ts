import { createEmbedding } from "./createEmbedding";
import { retrieveRelevantChunks } from "./retrieveRelevantChunks";
import { rerankChunks } from "./rerankChunks";
import { buildContext } from "./buildContext";
import { deduplicateChunks } from "./deduplicateChunks";

export async function retrieveContext(
    userId: number,
    question: string,
    options: {
        topK?: number;
        maxDistance?: number;
        documentId?: number;
    } = {}
) {
    const {
        topK = 5,
        maxDistance = 0.6,
        documentId,
    } = options;

    const embedding = await createEmbedding(question);

    const chunks = await retrieveRelevantChunks(
        userId,
        embedding,
        {
            topK: topK * 2,
            maxDistance,
            documentId,
        }
    );

    const rerankedChunks = rerankChunks(
        chunks,
        question,
        topK * 2
    );

    const deduplicatedChunks =
        deduplicateChunks(rerankedChunks);

    const finalChunks =
        deduplicatedChunks.slice(0, topK);

    const context = buildContext(
        finalChunks
    );

    return {
        context,
        chunks: finalChunks,
    };
}