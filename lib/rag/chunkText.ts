export function chunkText(
    text: string,
    chunkSize: number = 200,
    overlap: number = 40
): string[] {
    if (chunkSize <= overlap) {
        throw new Error(
            "chunkSize debe ser mayor que overlap."
        );
    }

    const words = text
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const chunks: string[] = [];

    const step = chunkSize - overlap;

    for (let start = 0; start < words.length; start += step) {
        const chunk = words.slice(
            start,
            start + chunkSize
        );

        if (chunk.length === 0) {
            break;
        }

        chunks.push(chunk.join(" "));

        if (start + chunkSize >= words.length) {
            break;
        }
    }

    return chunks;
}