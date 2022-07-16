import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { exec } from "child_process";

const app: Express = express();
const port = process.env.PORT ?? 8080;
const isDev = process.env.NODE_ENV !== "production";

const comments: Comment[] = [
  {
    author: {
      name: "Rob Hope",
      avatarURL: "",
    },
    text: "Jeepers now that's a huge release with some big community earnings to back it - it must be so rewarding seeing creators quit their day jobs after monetizing (with real MRR) on the new platform.",
    upvotes: 0,
    dateAdded: new Date(),
  },
  {
    author: {
      name: "Sophie Brecht",
      avatarURL: "",
    },
    text: "Switched our blog from Hubspot to Ghost a year ago -- turned out to be a great decision. Looking forward to this update....the in-platform analytics look especially delicious. :)",
    upvotes: 0,
    dateAdded: new Date(),
  },
];

type Comment = {
  author: {
    name: string;
    avatarURL: string;
  };
  text: string;
  upvotes: number;
  dateAdded: Date;
};

// Since the front-end is plain-jane js, we want to build the web
// We will be using nodemon's reloading to achieve this.
if (isDev) {
  exec("npm run build:web");
}

app.get("/comments", (req, res) => {
  return res.json({
    comments: comments,
  });
});

app.use(express.static("build/web"));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
