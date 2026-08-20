import { prisma } from "./prisma";
import { getTask } from "./tasks/getTask";
import { getTasks } from "./tasks/getTasks";
import { deleteTask } from "./tasks/deleteTask";
import { updateTask } from "./tasks/updateTask";
import { searchTasks } from "./tasks/searchTasks";
import { resolveTaskReference } from "./tasks/resolveTaskReference";

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

    //     const updatedTask = await updateTask(1, {
    //         taskId: 4,
    //         description: "null",
    //     });

    //     console.log("Tarea actualizada:", updatedTask);
    // }

    // const user = await prisma.user.upsert({
    //     where: {
    //         email: "test@example.com",
    //     },
    //     update: {},
    //     create: {
    //         name: "Test User",
    //         email: "test@example.com",
    //     },
    // });

    // console.log("Usuario de prueba:", user);

    // await prisma.task.createMany({
    //     data: [
    //         {
    //             userId: user.id,
    //             name: "Estudiar Programación Web",
    //             category: "study",
    //             priority: "high",
    //             dateText: "mañana",
    //             scheduledDate: new Date(),
    //             description: "Repasar HTML, CSS y JavaScript",
    //             subject: "Programación Web",
    //             estimatedTime: 120,
    //         },
    //         {
    //             userId: user.id,
    //             name: "Preparar examen",
    //             category: "exam",
    //             priority: "medium",
    //             dateText: "viernes",
    //             scheduledDate: new Date(),
    //             description: "Repasar temas para el examen",
    //             subject: "Programación Web",
    //             estimatedTime: 90,
    //         },
    //         {
    //             userId: user.id,
    //             name: "Leer documentación",
    //             category: "study",
    //             priority: "low",
    //             dateText: "sábado",
    //             scheduledDate: new Date(),
    //             description: "Revisar documentación de Prisma",
    //             subject: "Bases de Datos",
    //             estimatedTime: 60,
    //         },
    //     ],
    // });

    // const tasks = await searchTasks(
    // user.id,
    // "programación"
    // );

    // console.log("Resultados:", tasks);

    

    ////////////////// BUSQUEDA DE TAREAS DE UN USUARIO ///////////////////////

    // const tasks = await searchTasks(1, "programación");

    // console.log("Resultados:", tasks);


    // const user = await prisma.user.upsert({
    //     where: {
    //         email: "test@example.com",
    //     },
    //     update: {},
    //     create: {
    //         name: "Test User",
    //         email: "test@example.com",
    //     },
    // });
    

    // const result1 = await resolveTaskReference(
    //     user.id,
    //     "programación"
    // );

    // console.log("Programación:", result1);

    // const result2 = await resolveTaskReference(
    //     user.id,
    //     "HTML"
    // );

    // console.log("HTML:", result2);

    // const result3 = await resolveTaskReference(
    //     user.id,
    //     "matemáticas"
    // );

    // console.log("Matemáticas:", result3);


    const task = await prisma.task.create({
        data: {
            userId: 1,
            name: "Estudiar Programación Web",
            category: "study",
            priority: "high",
            dateText: "mañana",
            scheduledDate: new Date(),
            description: "Repasar HTML, CSS y JavaScript",
            subject: "Programación Web",
            estimatedTime: 120,
        },
    });

    console.log("Tarea recreada:", task);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());