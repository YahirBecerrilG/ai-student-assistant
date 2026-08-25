import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { createEmbedding } = await import(
        "../lib/rag/createEmbedding"
    );

    const embedding = await createEmbedding(
        "HTML es un lenguaje de marcado utilizado para estructurar páginas web."
    );

    console.log("EMBEDDING GENERADO");
    console.log("Dimensiones:", embedding.length);
    console.log("Primeros valores:", embedding.slice(0, 5));
}

main()
    .catch(console.error)
    .finally(() => process.exit());