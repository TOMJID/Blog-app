import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

//? getting all posts
const getAllPosts = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const {
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;
  const andConditions: PostWhereInput[] = [];

  //? search filter
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

  //? tags filter
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: payload.tags,
      },
    });
  }

  //? isFeatured filter
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }

  //? status filter
  if (status) {
    andConditions.push({
      status,
    });
  }

  //? authorId filter
  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const allPosts = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalData = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: allPosts,
    pagination: {
      totalData,
      page,
      limit,
      totalPages: Math.ceil(totalData / limit),
    },
  };
};

//? getting single post by id
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (timeline) => {
    await timeline.post.update({
      where: {
        id: postId,
      },
      data: {
        view: {
          increment: 1,
        },
      },
    });
    const postData = await timeline.post.findUnique({
      where: {
        id: postId,
      },
    });
    return postData;
  });
};

//? creating new post
const createPost = async (
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

export const PostService = {
  getAllPosts,
  getPostById,
  createPost,
};
