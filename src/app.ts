import express, { Application, Request, Response } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

//? json Parser
app.use(express.json());

//! better auth
app.all("/api/auth/*", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

//? post route
app.use("/posts", postRouter);

export default app;
