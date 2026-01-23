import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

//? get all posts
router.get("/", PostController.GetAllPosts);

//? get a single post my id
router.get("/:postId", PostController.GetPostById);

//? create new post
router.post("/", auth(UserRole.USER), PostController.CreatePost);

export const postRouter = router;
