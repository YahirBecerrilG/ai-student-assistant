import { prisma } from "../prisma";
import { Prisma } from "../../generated/prisma/client";

export async function createDocumentChunk(
    userId: number,
    documentId: number,
    content: string,
    metadata?: Record<string, unknown>
) {
    return prisma.documentChunk.create({
        data: {
            userId,
            documentId,
            content,
            metadata: metadata
                ? (metadata as Prisma.InputJsonValue)
                : undefined,
        },
    });
}