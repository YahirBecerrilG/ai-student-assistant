import OpenAI from "openai";
import { createEmbedding } from "./createEmbedding";
import { retrieveRelevantChunks } from "./retrieveRelevantChunks";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function answerWithContext(
    userId: number,
    question: string
) {
    const queryEmbedding = await createEmbedding(question);

    const chunks = await retrieveRelevantChunks(
        userId,
        queryEmbedding,
        5
    );

    if (chunks.length === 0) {
        return {
            answer:
                "No encontré información relevante en los documentos disponibles.",
            chunks: [],
        };
    }

    const context = chunks
        .map((chunk) => chunk.content)
        .join("\n\n");

    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [
            {
                role: "system",
                content: `
Eres un asistente académico.

Responde la pregunta del usuario utilizando
únicamente el contexto proporcionado.

Si el contexto no contiene información suficiente
para responder, indica que no tienes suficiente
información.

No inventes información.

CONTEXTO:
${context}
                `,
            },
            {
                role: "user",
                content: question,
            },
        ],
    });

    return {
        answer: completion.choices[0].message.content,
        chunks,
    };
}