import { prisma } from "../prisma";
import { chunkText } from "./chunkText";
import { createEmbedding } from "./createEmbedding";

export async function ingestDocument(
    userId: number,
    text: string,
    metadata?: Record<string, unknown>,
    chunkSize: number = 200,
    overlap: number = 40
) {
    const chunks = chunkText(
        text,
        chunkSize,
        overlap
    );

    const documentName =
        typeof metadata?.source === "string"
            ? metadata.source
            : "Documento sin nombre";

    const document = await prisma.document.create({
        data: {
            userId,
            name: documentName,
        },
    });

    const createdChunks = [];

    for (const content of chunks) {
        const embedding = await createEmbedding(content);

        const vector = `[${embedding.join(",")}]`;

        const result = await prisma.$queryRawUnsafe<
            { id: number }[]
        >(
            `
            INSERT INTO "DocumentChunk"
                ("userId", "documentId", content, metadata, embedding)
            VALUES
                ($1, $2, $3, $4::jsonb, $5::vector)
            RETURNING id
            `,
            userId,
            document.id,
            content,
            JSON.stringify(metadata ?? null),
            vector
        );

        createdChunks.push({
            id: result[0].id,
            documentId: document.id,
            content,
        });
    }

    return {
        document,
        chunks: createdChunks,
    };
}