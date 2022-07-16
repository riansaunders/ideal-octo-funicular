import { faker } from "@faker-js/faker";
import { PrismaClient, Comment } from "@prisma/client";
import "dotenv/config";
import express, { Express, Request } from "express";
import * as yup from "yup";

import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import cors from "cors";
import io, { Socket } from "socket.io";

import http from "http";

initializeApp({
  credential: cert(JSON.parse(String(process.env.FIREBASE_CREDENTIALS) || "")),
});

const expressApp: Express = express();
const httpServer = http.createServer(expressApp);
const ioServer = new io.Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT ?? 8080;
const prisma = new PrismaClient();

const sockets: Socket[] = [];

const commentSchema = yup.object({
  text: yup.string().required(),
  parent: yup.string().notRequired(),
});

const voteSchema = yup.object({
  commentId: yup.string().required(),
});

type ExtendedRequest = Request & {
  userId: string;
};
type CompleteComment = Comment & {
  upvotes: {
    userId: string;
    id: string;
  }[];
};

// This won't have authentication because of the nature of this codebase.

ioServer.on("connection", (socket) => {
  sockets.push(socket);
});

function transformComment(userId: string, comment: any): CompleteComment {
  return {
    ...comment,
    child: comment.child ? transformComment(userId, comment.child) : undefined,
    upvoteCount: comment.upvotes?.length || 0,
    upvoted:
      comment.upvotes?.findIndex((upvote: any) => upvote.userId === userId) !==
      -1,
    upvotes: undefined,
  };
}

function emitUpvoteChange(commentId: string, positive: boolean) {
  sockets.forEach((s) => s.emit(`upvote-${commentId}`, { positive: positive }));
}

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.static("build/web"));

expressApp.use(async (req, res, next) => {
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

expressApp.get("/comments", async (_req, res) => {
  const req = _req as ExtendedRequest;

  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      parent: null,
    },
    include: {
      child: {
        include: {
          upvotes: {},
        },
      },
      upvotes: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  const output = comments.map((comment) =>
    transformComment(req.userId, comment)
  );

  return res.json({
    comments: output,
  });
});

expressApp.post("/upvote", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { commentId } = voteSchema.validateSync(req.body);

    // There is a condition in the database that prevents us for upvoting the same comment twice.
    await prisma.upvote.create({
      data: {
        commentId: commentId,
        userId: req.userId,
      },
    });

    emitUpvoteChange(commentId, true);

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

expressApp.post("/downvote", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { commentId } = voteSchema.validateSync(req.body);

    await prisma.upvote.delete({
      where: {
        userId_commentId: {
          userId: req.userId,
          commentId: commentId,
        },
      },
    });

    emitUpvoteChange(commentId, false);

    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

expressApp.post("/comment", async (_req, res) => {
  try {
    const req = _req as ExtendedRequest;

    const { text, parent } = commentSchema.validateSync(req.body);

    const comment = await prisma.comment.create({
      data: {
        userId: req.userId,
        authorAvatarURL: faker.image.avatar(),
        authorName: faker.name.findName(),
        content: text,
        ...(parent
          ? {
              parent: {
                connect: {
                  id: parent,
                },
              },
            }
          : {}),
      },
    });
    return res.status(200).json({
      comment: transformComment(req.userId, comment),
    });
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
