import { CommentModel } from "../utils/types";

import humanize from "humanize-duration";
export type CommentViewProps = {
  comment: CommentModel;
};

export function CommentView({ comment }: CommentViewProps) {
  const diff = Date.now() - new Date(comment.createdAt).getTime();
  const timeElapsed =
    diff < 10000
      ? "moments"
      : humanize(diff, {
          round: true,
        });

  return (
    <div className="h-20 flex">
      <img
        src={comment.authorAvatarURL}
        className="rounded-full h-12 w-12 mr-3"
      />
      <div className="flex-1 space-y-2">
        <div className="space-x-1">
          <span className="font-semibold">{comment.authorName}</span>
          <span className="text-gray-400 text-sm">・ {timeElapsed} ago</span>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="space-x-4 text-[#4B587C] text-sm font-semibold">
          <span>
            <button className="">
              <svg
                className={(comment.upvoted ? "rotate-180" : "").concat(
                  " inline mr-2"
                )}
                width="12"
                height="12"
                viewBox="0 0 8 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.431818 7L4.14205 0.818182L7.84943 7H0.431818Z"
                  fill="#4B587C"
                />
              </svg>
              {comment.upvoted ? "Downvote" : "Upvote"}
            </button>
          </span>
          <button>Reply</button>
        </div>
      </div>
    </div>
  );
}
