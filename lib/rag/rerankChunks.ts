import type { RetrievedChunk } from "./retrieveRelevantChunks";
import { calculateKeywordScore } from "./keywordScore";

export function rerankChunks(
    chunks: RetrievedChunk[],
    question: string,
    topK: number
): RetrievedChunk[] {
    return [...chunks]
        .map((chunk) => {
            const keywordScore = calculateKeywordScore(
                question,
                chunk.content
            );

            const finalScore =
                chunk.similarity * 0.8 +
                keywordScore * 0.2;

            return {
                ...chunk,
                keywordScore,
                finalScore,
            };
        })
        .sort(
            (a, b) =>
                b.finalScore - a.finalScore
        )
        .slice(0, topK);
}