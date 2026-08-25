import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function createEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "openai/text-embedding-3-small",
        input: text,
    });

    return response.data[0].embedding;
}