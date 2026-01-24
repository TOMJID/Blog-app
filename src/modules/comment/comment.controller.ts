import { Request, Response } from "express";
import { CommentService } from "./comment.service";

//? creating new post
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      message: "Comment creation failed",
      details: error.message,
    });
  }
};

export const CommentController = {
  createComment,
};
