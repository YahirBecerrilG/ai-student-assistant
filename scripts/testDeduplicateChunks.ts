import { deduplicateChunks } from "../lib/rag/deduplicateChunks";
import type { RetrievedChunk } from "../lib/rag/retrieveRelevantChunks";

const chunks: RetrievedChunk[] = [
    {
        id: 1,
        documentId: 1,
        documentName: "css.pdf",
        content:
            "CSS permite cambiar colores y fondos.",
        metadata: null,
        distance: 0.20,
        similarity: 0.80,
    },
    {
        id: 2,
        documentId: 1,
        documentName: "css.pdf",
        content:
            "CSS   permite cambiar colores y fondos.",
        metadata: null,
        distance: 0.25,
        similarity: 0.75,
    },
    {
        id: 3,
        documentId: 2,
        documentName: "html.pdf",
        content:
            "HTML permite estructurar páginas web.",
        metadata: null,
        distance: 0.40,
        similarity: 0.60,
    },
];

const result = deduplicateChunks(chunks);

console.log("CHUNKS ORIGINALES:");
console.log(chunks);

console.log("\nCHUNKS DESPUÉS DE DEDUPLICAR:");
console.log(result);

console.log("\nTOTAL ORIGINAL:");
console.log(chunks.length);

console.log("\nTOTAL FINAL:");
console.log(result.length);

const passed =
    result.length === 2 &&
    result[0].id === 1 &&
    result[1].id === 3;

console.log(
    "\nDEDUPLICACIÓN:",
    passed ? "PASS ✅" : "FAIL ❌"
);