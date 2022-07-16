import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { exec } from "child_process";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

const app: Express = express();
const port = process.env.PORT ?? 8080;
const isDev = process.env.NODE_ENV !== "production";

const commentSchema = yup.object({
  text: yup.string().required(),
});

const upvoteSchema = yup.object({
  commentId: yup.string().required(),
  userId: yup.string().required(),
});

type Comment = {
  id: string;
  author: {
    name: string;
    avatarURL: string;
  };
  text: string;
  dateAdded: Date;
};
type CommentUpvote = {
  id: string;
  commentId: string;
  userId: string;
};

const comments: Comment[] = [
  {
    id: "first",
    author: {
      name: "Rian Saunders",
      avatarURL: "https://avatars.githubusercontent.com/u/56507515?v=4",
    },
    text: "This is my forever comment, in V1",
    dateAdded: new Date(),
  },
];

const upvotes: CommentUpvote[] = [
  {
    id: "first_upvote",
    userId: "rian",
    commentId: "first",
  },
];

// Since the front-end is plain-jane js, we want to build the web
// We will be using nodemon's reloading to achieve this.
if (isDev) {
  exec("npm run build:web");
}

app.use(express.json());

app.get("/comments", (req, res) => {
  return res.json({
    comments: comments,
    upvotes: upvotes,
  });
});

app.post("/upvote", (req, res) => {
  try {
    const { commentId, userId } = upvoteSchema.validateSync(req.body);

    const existing = upvotes.find(
      (c) => c.commentId === commentId && c.userId === userId
    );
    if (existing) {
      return res.status(400).end();
    }

    const newUpvote: CommentUpvote = {
      id: uuidv4(),
      commentId: commentId,
      userId: userId,
    };

    upvotes.push(newUpvote);

    console.log(upvotes);
    return res.status(200).json({
      upvote: newUpvote,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

app.post("/downvote", (req, res) => {
  try {
    const { commentId, userId } = upvoteSchema.validateSync(req.body);

    const existing = upvotes.findIndex(
      (c) => c.commentId === commentId && c.userId === userId
    );
    if (existing != -1) {
      upvotes.splice(existing, 1);
    }
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(400).end();
  }
});

app.post("/comment", (req, res) => {
  try {
    const { text } = commentSchema.validateSync(req.body);

    const newComment: Comment = {
      id: uuidv4(),
      author: {
        name: faker.name.findName(),
        avatarURL: faker.image.avatar(),
      },
      text: text,
      dateAdded: new Date(),
    };
    comments.push(newComment);
    return res.status(200).json({
      comment: newComment,
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
