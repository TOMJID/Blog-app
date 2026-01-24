import { prisma } from "../../lib/prisma";

//? getting comment by comment id
const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          replies: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      },
    },
  });
};

//? getting comment by author
const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

//? creating new post
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  const postData = await prisma.post.findUnique({
    where: {
      id: payload.postId,
    },
  });

  if (!postData) {
    throw new Error("Post not found");
  }

  if (payload.parentId) {
    const parentData = await prisma.comment.findUnique({
      where: {
        id: payload.parentId,
      },
    });

    if (!parentData) {
      throw new Error("Parent comment not found");
    }
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
  console.log(commentData);
};

export const CommentService = {
  getCommentById,
  getCommentByAuthor,
  createComment,
  deleteComment,
};
