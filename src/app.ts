import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRoute } from "./modules/comment/comment.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

//? json Parser
app.use(express.json());

//! CROS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

//! better auth
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello!");
});

//? post route
app.use("/posts", postRouter);

//? comment route
app.use("/comments", commentRoute);

//! global error handler
app.use(globalErrorHandler);

export default app;
