import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

//? getting all posts
const GetAllPosts = async () => {
  const allPosts = prisma.post.findMany();
  return allPosts;
};

//? creating new post
const CreatePost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

export const postService = {
  GetAllPosts,
  CreatePost,
};
