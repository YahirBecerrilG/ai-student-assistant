import { createEmbedding } from "./createEmbedding";
import { retrieveRelevantChunks } from "./retrieveRelevantChunks";
import { buildContext } from "./buildContext";

export async function retrieveContext(
    userId: number,
    question: string,
    options: {
        topK?: number;
        maxDistance?: number;
        documentId?: number;
    } = {}
) {
    const embedding = await createEmbedding(question);

    const chunks = await retrieveRelevantChunks(
        userId,
        embedding,
        options
    );

    const context = buildContext(chunks);

    return {
        context,
        chunks,
    };
}