import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helper/pagenationAndSortingHelper";
import { UserRole } from "../../middlewares/auth";

//? getting all posts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    //? for search
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    //? for togs
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    //? for isFeatured
    const isFeatured = (() => {
      switch (req.query.isFeatured) {
        case "true":
          return true;

        case "false":
          return false;

        default:
          return undefined;
      }
    })();

    //? for status
    const status = (() => {
      const queryStatus = req.query.status;
      switch (queryStatus) {
        case PostStatus.DRAFT:
          return PostStatus.DRAFT;

        case PostStatus.PUBLISHED:
          return PostStatus.PUBLISHED;

        case PostStatus.ARCHIVED:
          return PostStatus.ARCHIVED;
        default:
          return undefined;
      }
    })();

    //? for authorId
    const authorId = req.query.authorId as string | undefined;

    //? for pagination & sorting
    const options = paginationAndSortingHelper(req.query);
    const { page, limit, skip, sortBy, sortOrder } = options;

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Can't find any posts",
      details: error,
    });
  }
};

//? getting single post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("post id is required!");
    }
    const result = await PostService.getPostById(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post fetching failed",
      details: error,
    });
  }
};

//? creating new post
const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    //? if there aren't any user on session
    if (!user) {
      return res.status(404).json({
        error: "Unauthenticated",
      });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

//? get a user all posts
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are not logged in !");
    }
    const result = await PostService.getMyPosts(user.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post fetching failed",
      details: error.message,
    });
  }
};

//? update Post
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const isAdmin = user?.role === UserRole.ADMIN;

    if (!user) {
      throw new Error("You are not logged in !");
    }
    const { postId } = req.params;

    if (!postId) {
      throw new Error("Post id is required!");
    }
    const result = await PostService.updatePost(
      postId,
      req.body,
      user.id,
      isAdmin,
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post update failed",
      details: error.message,
    });
  }
};

//? delete post
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const isAdmin = user?.role === UserRole.ADMIN;

    if (!user) {
      throw new Error("You are not logged in !");
    }
    const { postId } = req.params;

    if (!postId) {
      throw new Error("Post id is required!");
    }
    const result = await PostService.deletePost(postId, user.id, isAdmin);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post delete failed",
      details: error.message,
    });
  }
};

//? post stats
const getStatus = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getStatus();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post status fetching failed",
      details: error.message,
    });
  }
};

export const PostController = {
  getAllPosts,
  getPostById,
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
  getStatus,
};
