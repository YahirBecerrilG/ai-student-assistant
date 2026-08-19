import { prisma } from "./prisma";
import { getTask } from "./tasks/getTask";
import { getTasks } from "./tasks/getTasks";
import { deleteTask } from "./tasks/deleteTask";
import { updateTask } from "./tasks/updateTask";

async function main() {
    
    ////////////////// CREACION DE USUARIO Y TAREA DE PRUEBA ///////////////////////
    // const user = await prisma.user.create({
    //     data: {
    //         name: "Test User",
    //         email: "test@example.com",
    //     },
    // });

    // console.log("Usuario creado:", user);

    // const task = await prisma.task.create({
    //     data: {
    //         userId: user.id,
    //         name: "Estudiar Cálculo",
    //         category: "study",
    //         priority: "high",
    //         dateText: "mañana",
    //         scheduledDate: new Date(),
    //         description: "Repasar cálculo para el examen.",
    //         subject: "Cálculo",
    //         estimatedTime: 120,
    //     },
    // });

    // console.log("Tarea creada:", task);

    ////////////////// OBTENER TODAS LAS TAREAS DE UN USUARIO ///////////////////////

    // const tasks = await getTasks(1); // Cambia el ID del usuario según sea necesario
    // console.log("Tareas del usuario:", tasks);

    ////////////////// OBTENER UNA TAREA ESPECÍFICA DE UN USUARIO ///////////////////////

    // const task = await getTask(1, 1);

    // console.log("Tarea encontrada:", task);

    // const nonexistentTask = await getTask(1, 999);

    // console.log("Tarea inexistente:", nonexistentTask);

    ////////////////// ELIMINAR UNA TAREA ESPECÍFICA DE UN USUARIO ///////////////////////

    // const deletedTask = await deleteTask(1, 2); // Cambia el ID del usuario y de la tarea según sea necesario
    // console.log("Tarea eliminada:", deletedTask);

    ////////////////// UPDATE UNA TAREA ESPECÍFICA DE UN USUARIO ///////////////////////

    const updatedTask = await updateTask(1, {
        taskId: 4,
        description: "null",
    });

    console.log("Tarea actualizada:", updatedTask);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());