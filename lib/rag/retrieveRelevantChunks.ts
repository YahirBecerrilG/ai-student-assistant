import { prisma } from "../prisma";

export async function retrieveRelevantChunks(
    userId: number,
    queryEmbedding: number[],
    limit: number = 5,
    maxDistance: number = 0.6
) {
    const vector = `[${queryEmbedding.join(",")}]`;

    return prisma.$queryRawUnsafe<
        {
            id: number;
            documentId: number;
            documentName: string;
            content: string;
            metadata: unknown;
            distance: number;
        }[]
    >(
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
        ORDER BY dc.embedding <=> $1::vector
        LIMIT $4
        `,
        vector,
        userId,
        maxDistance,
        limit
    );
}