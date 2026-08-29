export function calculateKeywordScore(
    question: string,
    content: string
): number {
    const questionWords = normalizeText(question);
    const contentWords = normalizeText(content);

    if (questionWords.length === 0) {
        return 0;
    }

    const matches = questionWords.filter(
        (word) => contentWords.includes(word)
    );

    return matches.length / questionWords.length;
}

function normalizeText(text: string): string[] {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .split(/\s+/)
        .filter((word) => word.length > 2);
}
