import type { RetrievedChunk } from "./retrieveRelevantChunks";

export function deduplicateChunks(
    chunks: RetrievedChunk[]
): RetrievedChunk[] {
    const seen = new Set<string>();

    return chunks.filter((chunk) => {
        const key = normalizeContent(chunk.content);

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function normalizeContent(content: string): string {
    return content
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}