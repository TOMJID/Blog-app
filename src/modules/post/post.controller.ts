import { Request, Response } from "express";
import { postService } from "./post.service";

const CreatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    //? if there aren't any user on session
    if (!user) {
      return res.status(404).json({
        error: "Unauthenticated",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

export const PostController = {
  CreatePost,
};
