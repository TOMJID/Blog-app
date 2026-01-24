import { prisma } from "../../lib/prisma";

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

export const CommentService = {
  createComment,
};
