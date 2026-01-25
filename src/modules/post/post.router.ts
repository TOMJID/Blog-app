import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

//? get all posts
router.get("/", PostController.getAllPosts);

//? get stats
router.get("/stats", PostController.getStatus);

//? get my posts
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts,
);

//? get a single post my id
router.get("/:postId", PostController.getPostById);

//? create new post
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost,
);

//? update post
router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost,
);

//? delete post
router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.deletePost,
);

export const postRouter = router;
