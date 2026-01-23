//? creating new post
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  console.log("payload: ", payload);

  return payload;
};

export const CommentService = {
  createComment,
};
