import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
const router = express.Router();
import { auth as betterAuth } from "../../lib/auth";

const auth = (...roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //? getting user session
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    console.log(session);
    next();
  };
};

router.post("/", auth("ADMIN", "USER"), PostController.CreatePost);

export const postRouter = router;
