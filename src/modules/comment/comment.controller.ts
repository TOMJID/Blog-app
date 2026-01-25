import { Request, Response } from "express";
import { CommentService } from "./comment.service";

//?getting comment by comment id
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

//?getting comment by author id
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentByAuthor(authorId);
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

//? deleting comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.deleteComment(
      commentId,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      message: "Comment deleting was unsuccessful",
      error: error.message,
    });
  }
};

//? update comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.updateComment(
      commentId,
      req.body,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      message: "Unable on update comment!",
      error: error.message,
    });
  }
};

//?for admin only to moderate comment
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.moderateComment(commentId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      message: "Unable on update comment status!",
      error: error.message,
    });
  }
};

export const CommentController = {
  getCommentById,
  getCommentByAuthor,
  createComment,
  deleteComment,
  updateComment,
  moderateComment,
};
