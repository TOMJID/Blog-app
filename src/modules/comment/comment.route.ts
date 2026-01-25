import Express from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Express.Router();

//? get comment by comment id
router.get("/:commentId", CommentController.getCommentById);

//? get comment by author id
router.get("/author/:authorId", CommentController.getCommentByAuthor);

//? create new post
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment,
);

//? deleting comment
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.deleteComment,
);

//? update comment
router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.updateComment,
);

//? for moderating comment
router.patch(
  "/moderate/:commentId",
  auth(UserRole.ADMIN),
  CommentController.moderateComment,
);

export const commentRoute = router;
