import { prisma } from "../lib/prisma";

async function main() {
    const user = await prisma.user.upsert({
        where: {
            email: "rag-test@example.com",
        },
        update: {},
        create: {
            name: "RAG Test User",
            email: "rag-test@example.com",
        },
    });

    console.log("USUARIO DE PRUEBA:");
    console.log(user);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });