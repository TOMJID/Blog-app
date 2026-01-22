import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

//? getting all post
const GetAllPosts = async (req: Request, res: Response) => {
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

    //? for pagination
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const result = await postService.GetAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Can't find any posts",
      details: error,
    });
  }
};

//? creating new post
const CreatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    //? if there aren't any user on session
    if (!user) {
      return res.status(404).json({
        error: "Unauthenticated",
      });
    }
    const result = await postService.CreatePost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

export const PostController = {
  GetAllPosts,
  CreatePost,
};
