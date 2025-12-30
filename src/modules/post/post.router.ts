import express, { Request, Response } from "express";
import { PostController } from "./post.controller";

const router = express.Router();

router.post("/", PostController.CreatePost);

export const postRouter = router;
