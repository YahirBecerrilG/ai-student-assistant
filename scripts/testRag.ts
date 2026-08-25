import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const { answerWithContext } = await import(
        "../lib/rag/answerWithContext"
    );

    const result = await answerWithContext(
        1,
        "¿Qué lenguaje se utiliza para estructurar páginas web?"
    );

    console.log("RESPUESTA RAG:");
    console.log(result.answer);

    console.log("\nCHUNKS UTILIZADOS:");
    console.log(result.chunks);
}

main()
    .catch(console.error)
    .finally(() => process.exit());