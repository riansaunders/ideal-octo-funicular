import { Comment } from "@prisma/client";

export type CommentModel = Comment & {
  upvotes: number;
  upvoted: boolean;
};
