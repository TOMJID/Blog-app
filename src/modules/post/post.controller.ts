import { Request, Response } from "express";
import { postService } from "./post.service";

//? getting all post
const GetAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const result = await postService.GetAllPosts({ search: searchString });
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Can't find any posts",
      details: error,
    });
  }
};

//? creating new post
const CreatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    //? if there aren't any user on session
    if (!user) {
      return res.status(404).json({
        error: "Unauthenticated",
      });
    }
    const result = await postService.CreatePost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

export const PostController = {
  GetAllPosts,
  CreatePost,
};
