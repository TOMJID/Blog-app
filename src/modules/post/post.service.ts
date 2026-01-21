import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

//? getting all posts
const GetAllPosts = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean;
}) => {
  const { search, tags, isFeatured } = payload;
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: payload.search, mode: "insensitive" } },
        { content: { contains: payload.search, mode: "insensitive" } },
        {
          tags: {
            has: payload.search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: payload.tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }
  const allPosts = prisma.post.findMany({
    where: {
      AND: andConditions,
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
