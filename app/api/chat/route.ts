import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { handleToolCall } from "@/lib/ai/toolHandler";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {

    const body = await req.json();
    const { message } = body;

    const userId = 1; // Temporalmente hasta implementar autenticación

    const tools = [
        {
            type: "function" as const,
            function: {
                name: "createTask",
                description: `
                Crea una nueva tarea académica cuando el usuario solicite
                explícitamente agregar, registrar, guardar o apuntar una actividad.

                No solicites información adicional para los campos opcionales.
                Si el usuario no proporciona prioridad, utiliza "unknown".
                Si no proporciona descripción, materia o tiempo estimado, utiliza null.
                No inventes información.

                Si el usuario indica que quiere estudiar, aprender, repasar o practicar
                un tema, utiliza "study".

                No solicites la categoría si puede inferirse razonablemente
                a partir de la intención del usuario.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Nombre de la tarea.",
                        },
                        category: {
                            type: "string",
                            enum: [
                                "exam",
                                "assignment",
                                "project",
                                "study",
                                "other"
                            ],
                            description: "Categoría de la tarea.",
                        },
                        priority: {
                            type: "string",
                            enum: [
                                "high",
                                "medium",
                                "low",
                                "unknown"
                            ],
                            description: "Prioridad indicada por el usuario.",
                        },
                        dateText: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                            description:
                                "Fecha expresada en lenguaje natural por el usuario.",
                        },
                        description: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                        subject: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                        estimatedTime: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                            description:
                                "Tiempo estimado expresado por el usuario.",
                        },
                    },
                    required: [
                        "name",
                        "category",
                        "priority",
                        "dateText",
                        "description",
                        "subject",
                        "estimatedTime",
                    ],
                    additionalProperties: false,
                },
            },
        },

        {
            type: "function" as const,
            function: {
                name: "getTasks",
                description: `
                Obtiene todas las tareas del usuario actual.

                Utiliza esta herramienta cuando el usuario solicite
                consultar, ver, listar o mostrar sus tareas.
                `,
                parameters: {
                    type: "object",
                    properties: {},
                    required: [],
                    additionalProperties: false,
                },
            },
        },

        {
            type: "function" as const,
            function: {
                name: "getTask",
                description: `
                Obtiene una tarea específica del usuario actual
                utilizando su ID.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        taskId: {
                            type: "number",
                            description:
                                "El ID de la tarea que se desea obtener.",
                        },
                    },
                    required: ["taskId"],
                    additionalProperties: false,
                },
            },
        },

        {
            type: "function" as const,
            function: {
                name: "deleteTask",
                description: `
                Elimina una tarea específica del usuario actual
                utilizando su ID.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        taskId: {
                            type: "number",
                            description:
                                "El ID de la tarea que se desea eliminar.",
                        },
                    },
                    required: ["taskId"],
                    additionalProperties: false,
                },
            },
        },

        {
            type: "function" as const,
            function: {
                name: "updateTask",
                description: `
                Actualiza uno o varios campos de una tarea del usuario actual.

                Solo modifica los campos que el usuario solicite cambiar.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        taskId: {
                            type: "number",
                            description:
                                "El ID de la tarea que se desea actualizar.",
                        },
                        name: {
                            type: "string",
                            description:
                                "Nuevo nombre de la tarea.",
                        },
                        category: {
                            type: "string",
                            enum: [
                                "exam",
                                "assignment",
                                "project",
                                "study",
                                "other"
                            ],
                        },
                        priority: {
                            type: "string",
                            enum: [
                                "high",
                                "medium",
                                "low",
                                "unknown"
                            ],
                        },
                        dateText: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                        description: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                        subject: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                        estimatedTime: {
                            anyOf: [
                                { type: "string" },
                                { type: "null" },
                            ],
                        },
                    },
                    required: ["taskId"],
                    additionalProperties: false,
                },
            },
        },
    ];

    const MAX_TOOL_ROUNDS = 5;

    const conversationMessages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `
            Eres un asistente académico llamado AI Student Assistant.

            Tu función es ayudar a los estudiantes a organizar
            y gestionar sus actividades académicas.

            Cuando el usuario solicite explícitamente agregar, registrar,
            guardar o apuntar una actividad, utiliza la herramienta createTask.

            Las fechas expresadas en lenguaje natural como "hoy",
            "mañana", "el viernes" o "el próximo lunes" son fechas válidas.

            No solicites al usuario una fecha absoluta si ya proporcionó
            una fecha relativa.

            No inventes información.

            Si el usuario no proporciona prioridad, utiliza "unknown".

            Si no proporciona descripción, materia o tiempo estimado,
            utiliza null.

            Si el usuario indica que quiere estudiar, aprender, repasar
            o practicar un tema, utiliza la categoría "study".

            Si el usuario no proporciona una categoría explícita y no puede
            inferirse de forma razonable, utiliza "other".

            Cuando una tarea debe eliminarse o actualizarse y el usuario
            no proporciona directamente su ID, utiliza las herramientas
            disponibles para localizar primero la tarea correspondiente.

            Puedes utilizar varias herramientas en diferentes rondas
            para completar una solicitud.

            Responde de forma clara, concisa y útil.
            `,
        },
        {
            role: "user",
            content: message,
        },
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash",
            messages: conversationMessages,
            tools,
            tool_choice: "auto",
        });

        const assistantMessage =
            completion.choices[0].message;

        conversationMessages.push(assistantMessage);

        const toolCalls =
            assistantMessage.tool_calls;

        // El modelo ya puede responder directamente
        if (!toolCalls || toolCalls.length === 0) {

            return Response.json({
                message: assistantMessage.content,
            });
        }

        // Ejecutamos todas las tools solicitadas
        for (const toolCall of toolCalls) {

            const toolResult =
                await handleToolCall(
                    toolCall,
                    userId
                );

            conversationMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult),
            });
        }
    }

    return Response.json({
        message:
            "No fue posible completar la operación después de varios intentos.",
    });
}