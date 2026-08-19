import OpenAI from "openai"; // Importamos cliente para comunicarnos con OpenRouter
import { createTask } from "@/lib/tasks/createTask";
import { getTasks } from "@/lib/tasks/getTasks";
import { getTask } from "@/lib/tasks/getTask";
import { deleteTask } from "@/lib/tasks/deleteTask";
import { updateTask } from "@/lib/tasks/updateTask";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // Deginimos que la API key se encuentra en las variables de entorno
  baseURL: "https://openrouter.ai/api/v1", // Definimos la URL base de la API de OpenRouter
});

export async function POST(req: Request) {   // Definimos la función POST que se ejecutará cuando se haga una solicitud POST a esta ruta
    const body = await req.json(); // Obtenemos el cuerpo de la solicitud en formato JSON
    const { message } = body; // Obtenemos el mensaje del cuerpo de la solicitud
    const completion = await openai.chat.completions.create({ // Creamos una nueva solicitud de completado de chat a la API de OpenRouter
        model: "google/gemini-2.5-flash", // Definimos el modelo que queremos usar para generar la respuesta
        messages: [ // Definimos los mensajes que se enviarán al modelo para generar la respuesta
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

                Responde de forma clara, concisa y útil.
                `,
            },
            {
                role: "user",
                content: message,
            },
        ],
        tools: [
            {
                type: "function",
                function: {
                name: "createTask",
               description: `
                Crea una nueva tarea académica cuando el usuario solicite
                explícitamente agregar, registrar, guardar o apuntar una actividad.

                No solicites información adicional para los campos opcionales.
                Si el usuario no proporciona prioridad, utiliza "unknown".
                Si no proporciona descripción, materia o tiempo estimado, utiliza null.
                No inventes información.
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
                        enum: ["exam", "assignment", "project", "study", "other"],
                        description: "Categoría de la tarea.",
                    },
                    priority: {
                        type: "string",
                        enum: ["high", "medium", "low", "unknown"],
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
                type: "function",
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
                }
                }
            },
            {
                type: "function",
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
                                description: "El ID de la tarea que se desea obtener."
                            }
                        },
                        required: ["taskId"],
                        additionalProperties: false
                    }
                }
            },
            {
                type: "function",
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
                                description: "El ID de la tarea que se desea eliminar."
                            }
                        },
                        required: ["taskId"],
                        additionalProperties: false
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "updateTask",
                    description: `Actualiza uno o varios campos de una tarea del usuario actual.
                    Solo modifica los campos que el usuario solicite cambiar.
                    `,
                    parameters: {
                        type: "object",
                        properties: {
                            taskId: {
                                type: "number",
                                description: "El ID de la tarea que se desea actualizar."
                            },
                            name: {
                                type: "string",
                                description: "Nuevo nombre de la tarea."
                            },
                            category: {
                                type: "string",
                                enum: ["exam", "assignment", "project", "study", "other"]
                            },
                            priority: {
                                type: "string",
                                enum: ["high", "medium", "low", "unknown"]
                            },
                            dateText: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "null" }
                                ]
                            },
                            description: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "null" }
                                ]
                            },
                            subject: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "null" }
                                ]
                            },
                            estimatedTime: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "null" }
                                ]
                            }
                        },
                        required: ["taskId"],
                        additionalProperties: false
                    }
                }
            }
        ],
            tool_choice: "auto"
        // response_format: { // Definimos el formato de respuesta que queremos recibir del modelo
        //     type: "json_schema", // Definimos que queremos recibir la respuesta en formato JSON Schema
        //     json_schema: { // Definimos el esquema JSON que queremos recibir del modelo
        //         name: "response", // Definimos el nombre del esquema JSON
        //         schema: { // Definimos el esquema JSON que queremos recibir del modelo
        //             type: "object", // Definimos que queremos recibir un objeto JSON
        //             properties: { 
        //                 tasks: { // Definimos la propiedad tasks que será un arreglo de objetos JSON
        //                     type: "array", // Definimos que tasks será un arreglo
        //                     items: {
        //                         type: "object", // Definimos que cada elemento del arreglo será un objeto JSON
        //                         properties: {    
        //                             name: { type: "string" },
        //                             category: { type: "string", enum: ["exam", "assignment", "project", "study", "other"] },
        //                             priority: { type: "string", enum: ["high", "medium", "low", "unknown"] },
        //                             dateText: { anyOF: 
        //                                 [{ type: "string" }, { type: "null" }] },
        //                             description: { anyOF: 
        //                                 [{ type: "string" }, { type: "null" }] },
        //                             subject: { anyOF: 
        //                                 [{ type: "string" }, { type: "null" }] },
        //                             estimatedTime: { anyOF: 
        //                                 [{ type: "string" }, { type: "null" }] },
        //                         },
        //                         required: ["name", "category", "priority", "dateText", "description", "subject", "estimatedTime"], // Definimos que todas las propiedades son requeridas
        //                         additionalProperties: false, // Definimos que no queremos recibir propiedades adicionales en el objeto JSON
        //                     }
        //                 }
        //             }, 
        //             required: ["tasks"], // Definimos que la propiedad tasks es requerida
        //             additionalProperties: false, // Definimos que no queremos recibir propiedades adicionales en el objeto JSON
        //         }
        //     }
        // }
    });
    //const task = JSON.parse(completion.choices[0].message.content ?? "{}"); // Parseamos la respuesta del modelo a un objeto JSON

    const toolCall =
    completion.choices[0].message.tool_calls?.[0];

    if (!toolCall) {
        return Response.json({
            message: completion.choices[0].message.content
        });
    }

    if (toolCall.type !== "function") {
    return Response.json({
        message: "El tipo de tool no es compatible."
    });
}

    const toolArguments = JSON.parse(
        toolCall.function.arguments
    );

    const userId = 1; // Temporalmenta hasta que se implemente la autenticación de usuarios
    let toolResult;


    if (toolCall.function.name === "createTask") {
        
        const task = await createTask(userId, toolArguments);

        toolResult = {
            success: true,
            task
        };

    }else if (toolCall.function.name === "getTasks") {
        const tasks = await getTasks(userId);

        toolResult = {
            success: true,
            tasks
        };


    
    }else if (toolCall.function.name === "getTask") {
        const task = await getTask(userId, toolArguments.taskId);

        toolResult = {
            success: true,
            task
        };


    }else if (toolCall.function.name === "deleteTask") {
        
        const task = await deleteTask(userId, toolArguments.taskId);

        toolResult = {
            success: task !== null,
            task
        };

    } else if (toolCall.function.name === "updateTask") {
        const task = await updateTask(userId, toolArguments);
        
        toolResult = {
            success: task !== null,
            task
        };
        
    }else {
        return Response.json({
        success: false,
        message: `Tool no reconocida: ${toolCall.function.name}`
        });
    }

    const finalCompletion =
            await openai.chat.completions.create({
                model: "google/gemini-2.5-flash",
                messages: [
                    {
                        role: "system",
                        content: `
                        Eres un asistente académico llamado AI Student Assistant.

                        Explica al usuario de forma clara y concisa
                        el resultado de las acciones que se hayan ejecutado.
                        `
                    },
                    {
                        role: "user",
                        content: message
                    },
                    completion.choices[0].message,
                    {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(toolResult)
                    }
                ],
            });
    
    return Response.json({
        message: finalCompletion.choices[0].message.content
    });

    
}
