import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

//? getting all posts
const GetAllPosts = async (payload: { search: string | undefined }) => {
  const allPosts = prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: payload.search, mode: "insensitive" } },
        { content: { contains: payload.search, mode: "insensitive" } },
      ],
    },
  });
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
