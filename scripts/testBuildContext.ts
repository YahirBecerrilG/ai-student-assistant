import { buildContext } from "../lib/rag/buildContext";
import type { RetrievedChunk } from "../lib/rag/retrieveRelevantChunks";

const chunks: RetrievedChunk[] = [
    {
        id: 1,
        documentId: 10,
        documentName: "guia-programacion-web.pdf",
        content:
            "CSS permite cambiar colores, fondos y estilos visuales de una página web.",
        metadata: {
            subject: "Programación Web",
            page: 3,
        },
        distance: 0.25,
    },
    {
        id: 2,
        documentId: 10,
        documentName: "guia-programacion-web.pdf",
        content:
            "JavaScript permite agregar comportamiento e interactividad a las páginas web.",
        metadata: {
            subject: "Programación Web",
            page: 5,
        },
        distance: 0.42,
    },
];

const context = buildContext(chunks);

console.log("CONTEXTO GENERADO:");
console.log(context);

console.log("\n=== TEST SIN CHUNKS ===");

const emptyContext = buildContext([]);

console.log(
    emptyContext === ""
        ? "OK: contexto vacío"
        : emptyContext
);