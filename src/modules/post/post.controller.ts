import { Request, Response } from "express";

const CreatePost = async (req: Request, res: Response) => {
  res.send("Create a new port");
};

export const PostController = {
  CreatePost,
};
