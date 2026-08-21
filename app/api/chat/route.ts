import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { handleToolCall } from "@/lib/ai/toolHandler";
import {
    getPendingAction,
    clearPendingAction
} from "@/lib/ai/pendingAction";

import { deleteTask } from "@/lib/tasks/deleteTask";
import { resolveTaskReference } from "@/lib/tasks/resolveTaskReference";
import { updateTask } from "@/lib/tasks/updateTask";
import { prisma } from "@/lib/prisma";
import { mapPrismaTaskToTask } from "@/lib/tasks/taskMapper";

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {

    const body = await req.json();
    const { message } = body;

    const userId = 1; // Temporalmente hasta implementar autenticación

    const pendingAction = await getPendingAction(userId);

    console.log(
        "PENDING ACTION:",
        pendingAction
    );

    if (
        pendingAction &&
        pendingAction.userId === userId
    ) {

        const normalizedMessage = message
            .trim()
            .toLowerCase();

        const confirmations = [
            "sí",
            "si",
            "sí, hazlo",
            "si, hazlo",
            "correcto",
            "confirmo",
            "adelante",
            "elimínala",
            "eliminala"
        ];

        /*
        * ============================
        * DELETE TASK
        * ============================
        */

        if (
            pendingAction.action === "deleteTask" &&
            confirmations.includes(normalizedMessage)
        ) {

            const deletedTask = await deleteTask(
                userId,
                pendingAction.taskId
            );

            await clearPendingAction(userId);

            if (!deletedTask) {
                return Response.json({
                    message:
                        "No pude encontrar la tarea que estaba pendiente de eliminar."
                });
            }

            return Response.json({
                message:
                    `Listo. He eliminado la tarea "${deletedTask.name}".`
            });
        }

        /*
        * ============================
        * UPDATE TASK
        * ============================
        */

        if (pendingAction.action === "updateTask") {

            console.log(
                "UPDATE PENDING MESSAGE:",
                message
            );

            const candidateTasksPrisma = await prisma.task.findMany({
                where: {
                    id: {
                        in: pendingAction.candidateTaskIds
                    },
                    userId
                }
            });

            const candidateTasks = candidateTasksPrisma.map(
                mapPrismaTaskToTask
            );

            const resolution = await resolveTaskReference(
                userId,
                message,
                candidateTasks
            );

            console.log(
                "UPDATE RESOLUTION:",
                resolution
            );

            if (resolution.status === "not_found") {

                return Response.json({
                    message:
                        "No pude identificar cuál de las tareas quieres actualizar. Indícame el nombre de la tarea."
                });
            }

            if (resolution.status === "ambiguous") {

                return Response.json({
                    message:
                        "La referencia sigue siendo ambigua. Por favor, indícame el nombre exacto de la tarea que deseas actualizar."
                });
            }

            const updatedTask = await updateTask(
                userId,
                {
                    taskId: resolution.task.id,
                    ...pendingAction.updates
                }
            );

            await clearPendingAction(userId);

            if (!updatedTask) {
                return Response.json({
                    message:
                        "No pude actualizar la tarea seleccionada."
                });
            }

            return Response.json({
                message:
                    `He actualizado la tarea "${updatedTask.name}" correctamente.`
            });
        }
    }

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
                Elimina una tarea del usuario actual.

                Utiliza taskId SOLO cuando el usuario haya proporcionado
                explícitamente el ID numérico de la tarea.

                Si el usuario identifica la tarea mediante su nombre,
                materia, descripción o palabras clave, utiliza taskReference.

                Nunca inventes, deduzcas ni proporciones un taskId que
                el usuario no haya mencionado explícitamente.
                `,
                parameters: {
                    type: "object",
                    properties: {

                        taskReference: {
                            type: "string",
                            description:
                                "Nombre, materia, descripción o palabras clave que permitan localizar la tarea.",
                        },
                    },
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

                Utiliza esta herramienta cuando el usuario quiera modificar
                una tarea existente.

                Si el usuario proporciona explícitamente un ID numérico,
                utiliza taskId.

                Si el usuario NO proporciona un ID, pero identifica la tarea
                por su nombre, materia, descripción o palabras clave,
                DEBES utilizar taskReference.

                No utilices searchTasks como paso previo para actualizar
                una tarea. Utiliza directamente updateTask con taskReference.

                Ejemplo:

                Usuario:
                "Pon en baja la prioridad de mi tarea de HTML"

                Debes llamar:

                {
                    "taskReference": "HTML",
                    "priority": "low"
                }

                Nunca inventes un taskId.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        taskId: {
                            type: "number",
                            description:
                                "El ID de la tarea que se desea actualizar.",
                        },

                         taskReference: {
                            type: "string",
                            description:
                                "Nombre, materia, descripción o palabras clave para localizar la tarea cuando el usuario no proporciona un ID.",
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
                    required: [],
                    additionalProperties: false,
                },
                
            },
        },
        {
            type: "function" as const,
            function: {
                name: "searchTasks",
                description: `
                Busca tareas del usuario actual que coincidan con un término
                en el nombre, materia o descripción.

                Utiliza esta herramienta cuando el usuario haga referencia
                a una tarea sin proporcionar directamente su ID, especialmente
                cuando necesites localizar una tarea para consultarla,
                actualizarla o eliminarla.
                `,
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description:
                                "Término o palabras clave utilizadas para localizar la tarea.",
                        },
                    },
                    required: ["query"],
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
                no proporciona directamente su ID, primero utiliza searchTasks
                para localizar la tarea.

                Cuando el usuario quiera actualizar una tarea y no proporcione
                directamente su ID, utiliza updateTask proporcionando
                taskReference.

                No utilices searchTasks para localizar previamente una tarea
                que deseas actualizar.

                updateTask se encargará de resolver la referencia y determinar
                si existe una coincidencia única o si es necesario pedir
                aclaración al usuario.

                Cuando el usuario quiera eliminar una tarea y no proporcione
                directamente su ID, utiliza deleteTask proporcionando
                taskReference.

                No inventes taskIds.

                Si searchTasks no devuelve ninguna tarea, informa al usuario
                que no fue posible localizarla.

                Nunca inventes un taskId.

                Cuando una operación requiera varias herramientas, ejecuta las
                herramientas en el orden necesario para completar la solicitud.
                Utiliza el resultado de una herramienta como entrada para la
                siguiente cuando sea necesario.

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

            if (
                typeof toolResult === "object" &&
                toolResult !== null &&
                "status" in toolResult &&
                toolResult.status === "confirmation_required" &&
                "task" in toolResult &&
                toolResult.task
            ) {
                return Response.json({
                    message: `Encontré la tarea "${toolResult.task.name}". ¿Quieres eliminarla?`
                });
            }

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