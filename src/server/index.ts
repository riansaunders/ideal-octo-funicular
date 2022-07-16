import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { exec } from "child_process";

const app: Express = express();
const port = process.env.PORT ?? 8080;
const isDev = process.env.NODE_ENV !== "production";

// Since the front-end is plain-jane js, we want to build the web
// We will be using nodemon's reloading to achieve this.
if (isDev) {
  exec("npm run build:web");
}

app.use(express.static("dist/web"));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
