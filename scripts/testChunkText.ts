import { chunkText } from "../lib/rag/chunkText";

const text = `
HTML es un lenguaje de marcado utilizado para estructurar
el contenido de las páginas web. CSS permite definir estilos
y presentación. JavaScript permite agregar comportamiento
e interactividad a las páginas web. El DOM representa la
estructura del documento y permite modificar sus elementos.
`;

const chunks = chunkText(text, 20, 5);

console.log("TOTAL DE CHUNKS:", chunks.length);

chunks.forEach((chunk, index) => {
    console.log(`\n--- CHUNK ${index + 1} ---`);
    console.log(chunk);
});