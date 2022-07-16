import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.comment.create({
      data: {
        authorAvatarURL: `https://avatars.githubusercontent.com/u/56507515?s=40&v=4`,
        authorName: `Rian Saunders`,
        content: `A forever comment!`,
        userId: "rian_saunders",
        createdAt: new Date(),
        id: "rian_comment",
        child: {
          create: {
            authorAvatarURL: `https://avatars.githubusercontent.com/u/56507515?s=40&v=4`,
            authorName: `Rian Saunders`,
            content: `I'm replying to myself :-)`,
            userId: "rian_saunders",
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
}

seed();
