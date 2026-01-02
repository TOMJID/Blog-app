import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

//? json Parser
app.use(express.json());

//! better auth
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello!");
});

//? post route
app.use("/posts", postRouter);

export default app;
