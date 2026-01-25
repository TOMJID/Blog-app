import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
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
    include: {
      _count: {
        select: { comments: true },
      },
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
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
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

//? get a user all posts
const getMyPosts = async (authorId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (userInfo?.status !== "ACTIVE") {
    throw new Error("User isn't active");
  }

  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },
    where: {
      authorId,
    },
  });

  return {
    data: result,
    total,
  };
};

//? update posts
const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data,
  });
  return result;
};

//? delete post
const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!postData) {
    throw new Error("Post not found");
  }
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not authorized to delete this post");
  }
  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return result;
};

export const PostService = {
  getAllPosts,
  getPostById,
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
};
