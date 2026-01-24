import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

//? get all posts
router.get("/", PostController.getAllPosts);

//? get a single post my id
router.get("/:postId", PostController.getPostById);

//? create new post
router.post("/", auth(UserRole.USER), PostController.createPost);

export const postRouter = router;
