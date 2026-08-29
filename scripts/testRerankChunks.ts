import { rerankChunks } from "../lib/rag/rerankChunks";
import type { RetrievedChunk } from "../lib/rag/retrieveRelevantChunks";

const chunks: RetrievedChunk[] = [
    {
        id: 1,
        documentId: 1,
        documentName: "documento-a.pdf",
        content:
            "JavaScript permite agregar comportamiento e interactividad a las páginas web.",
        metadata: null,
        distance: 0.30,
        similarity: 0.70,
    },
    {
        id: 2,
        documentId: 1,
        documentName: "documento-a.pdf",
        content:
            "CSS permite cambiar colores, fondos y estilos visuales de una página web.",
        metadata: null,
        distance: 0.35,
        similarity: 0.65,
    },
    {
        id: 3,
        documentId: 2,
        documentName: "documento-b.pdf",
        content:
            "HTML permite estructurar el contenido de las páginas web.",
        metadata: null,
        distance: 0.40,
        similarity: 0.60,
    },
];

const originalIds = chunks.map((chunk) => chunk.id);

const reranked = rerankChunks(
    chunks,
    "¿Cómo cambiar los colores de una página web?",
    2
);

console.log("RESULTADO DEL RERANKING:");
console.log(reranked);

console.log("\nIDS ORIGINALES:");
console.log(originalIds);

console.log("\nIDS RERANKED:");
console.log(reranked.map((chunk) => chunk.id));

const correctOrder =
    reranked.length === 2 &&
    reranked[0].id === 2 &&
    reranked[1].id === 1;

const originalUnchanged =
    chunks.map((chunk) => chunk.id).join(",") ===
    originalIds.join(",");

console.log(
    "\nORDEN CORRECTO:",
    correctOrder ? "PASS ✅" : "FAIL ❌"
);

console.log(
    "ARREGLO ORIGINAL SIN MODIFICAR:",
    originalUnchanged ? "PASS ✅" : "FAIL ❌"
);