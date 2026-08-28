import type { RetrievedChunk } from "./retrieveRelevantChunks";

export function buildContext(
    chunks: RetrievedChunk[]
): string {
    if (chunks.length === 0) {
        return "";
    }

    return chunks
        .map((chunk, index) => {
            return [
                `[FUENTE ${index + 1}]`,
                `Documento: ${chunk.documentName}`,
                `Contenido: ${chunk.content}`,
            ].join("\n");
        })
        .join("\n\n---\n\n");
}