import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import express, { Express, Request } from "express";
import * as yup from "yup";

import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import cors from "cors";

initializeApp({
  credential: cert(JSON.parse(String(process.env.FIREBASE_CREDENTIALS) || "")),
});

const app: Express = express();
const port = process.env.PORT ?? 8080;

type ExtendedRequest = Request & {
  userId: string;
};

const prisma = new PrismaClient();

const commentSchema = yup.object({
  text: yup.string().required(),
});

const upvoteSchema = yup.object({
  commentId: yup.string().required(),
  userId: yup.string().required(),
});

app.use(cors());

app.use(express.json());

app.use(async (req, res, next) => {
  const [type, token] = req.headers.authorization?.split(" ") || [];

  // console.log(type, token);
  if (!type || !token || type !== "Bearer") {
    return res.status(403).end();
  }
  try {
    const claim = await getAuth().verifyIdToken(token);
    /** @ts-ignore */
    req.userId = claim.uid;

    next();
  } catch (err) {
    console.error(err);
    return res.status(403).end();
  }
});

app.get("/comments", async (_req, res) => {
  const req = _req as ExtendedRequest;

  const comments = await prisma.comment.findMany({
    include: {
      upvotes: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });
  const output = comments.map((comment) => {
    return {
      ...comment,
      upvoteCount: comment.upvotes.length,
      upvoted:
        comment.upvotes.findIndex((upvote) => upvote.userId === req.userId) !==
        -1,
    };
  });

  return res.json({
    comments: output,
  });
});

app.post("/upvote", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { commentId } = upvoteSchema.validateSync(req.body);

    // There is a condition in the database that prevents us for upvoting the same comment twice.
    await prisma.upvote.create({
      data: {
        commentId: commentId,
        userId: req.userId,
      },
    });

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

app.post("/downvote", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { commentId } = upvoteSchema.validateSync(req.body);

    await prisma.upvote.delete({
      where: {
        userId_commentId: {
          userId: req.userId,
          commentId: commentId,
        },
      },
    });
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

app.post("/comment", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { text } = commentSchema.validateSync(req.body);

    const comment = await prisma.comment.create({
      data: {
        userId: req.userId,
        authorAvatarURL: faker.image.avatar(),
        authorName: faker.name.findName(),
        content: text,
      },
    });
    return res.status(200).json({
      comment: comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

app.use(express.static("build/web"));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
