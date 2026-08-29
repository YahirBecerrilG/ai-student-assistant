import { calculateKeywordScore } from "../lib/rag/keywordScore";

const question =
    "¿Cómo cambiar el color de fondo con CSS?";

const cssContent =
    "CSS permite cambiar colores, fondos y estilos visuales.";

const javascriptContent =
    "JavaScript permite agregar comportamiento e interactividad.";

const cssScore = calculateKeywordScore(
    question,
    cssContent
);

const javascriptScore = calculateKeywordScore(
    question,
    javascriptContent
);

console.log("PREGUNTA:");
console.log(question);

console.log("\nCSS SCORE:");
console.log(cssScore);

console.log("\nJAVASCRIPT SCORE:");
console.log(javascriptScore);

console.log("\nRESULTADO:");

console.log(
    cssScore > javascriptScore
        ? "CSS tiene mayor coincidencia ✅"
        : "ERROR ❌"
);