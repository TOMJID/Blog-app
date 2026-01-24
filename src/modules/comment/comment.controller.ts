import { Request, Response } from "express";
import { CommentService } from "./comment.service";

//?getting comment by id
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      message: "Comment creation failed",
      details: error.message,
    });
  }
};

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
  getCommentById,
  createComment,
};
