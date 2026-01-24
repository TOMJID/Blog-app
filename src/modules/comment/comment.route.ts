import Express from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Express.Router();

//? get comment by id
router.get("/:commentId", CommentController.getCommentById);

//? create new post
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment,
);

export const commentRoute = router;
