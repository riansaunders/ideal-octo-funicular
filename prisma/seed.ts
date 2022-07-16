import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.comment.create({
    data: {
      authorAvatarURL: `https://avatars.githubusercontent.com/u/56507515?s=40&v=4`,
      authorName: `Rian Saunders`,
      content: `A forever comment!`,
      userId: "rian_saunders",
      createdAt: new Date(),
    },
  });
}

seed();
