import { prisma } from "../prisma";

export interface RetrievedChunk {
    id: number;
    documentId: number;
    documentName: string;
    content: string;
    metadata: unknown;
    distance: number;
}

interface RetrievalOptions {
    topK?: number;
    maxDistance?: number;
    documentId?: number;
}

export async function retrieveRelevantChunks(
    userId: number,
    queryEmbedding: number[],
    options: RetrievalOptions = {}
) {
    const {
        topK = 5,
        maxDistance = 0.6,
        documentId,
    } = options;

    const vector = `[${queryEmbedding.join(",")}]`;

    const documentFilter =
        documentId !== undefined
            ? `AND dc."documentId" = $5`
            : "";

    return prisma.$queryRawUnsafe<RetrievedChunk[]>(
        `
        SELECT
            dc.id,
            dc."documentId",
            d.name AS "documentName",
            dc.content,
            dc.metadata,
            dc.embedding <=> $1::vector AS distance
        FROM "DocumentChunk" dc
        INNER JOIN "Document" d
            ON d.id = dc."documentId"
        WHERE dc."userId" = $2
          AND dc.embedding IS NOT NULL
          AND dc.embedding <=> $1::vector <= $3
          ${documentFilter}
        ORDER BY dc.embedding <=> $1::vector
        LIMIT $4
        `,
        vector,
        userId,
        maxDistance,
        topK,
        ...(documentId !== undefined ? [documentId] : [])
    );
}