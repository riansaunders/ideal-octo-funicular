import { Comment } from "@prisma/client";

export type CommentModel = Comment & {
  upvoteCount: number;
  upvoted: boolean;

  child: CommentModel;
};
