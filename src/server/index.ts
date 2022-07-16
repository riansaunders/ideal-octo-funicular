import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { exec } from "child_process";
import * as yup from "yup";

import { faker } from "@faker-js/faker";

const app: Express = express();
const port = process.env.PORT ?? 8080;
const isDev = process.env.NODE_ENV !== "production";

const commentSchema = yup.object({
  text: yup.string().required(),
});

type Comment = {
  author: {
    name: string;
    avatarURL: string;
  };
  text: string;
  upvotes: number;
  dateAdded: Date;
};
const comments: Comment[] = [
  {
    author: {
      name: "Rian Saunders",
      avatarURL: "https://avatars.githubusercontent.com/u/56507515?v=4",
    },
    text: "This is my forever comment, in V1",
    upvotes: 0,
    dateAdded: new Date(),
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
  });
});

app.post("/comment", (req, res) => {
  try {
    const { text } = commentSchema.validateSync(req.body);

    const newComment: Comment = {
      author: {
        name: faker.name.findName(),
        avatarURL: faker.image.avatar(),
      },
      text: text,
      upvotes: 0,
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
