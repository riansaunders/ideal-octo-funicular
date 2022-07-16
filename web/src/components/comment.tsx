import { CommentModel } from "../utils/types";

import humanize from "humanize-duration";
import { useContext, useState } from "react";
import { client } from "../utils/http";
import { DiscussionContext } from "../App";
export type CommentViewProps = {
  comment: CommentModel;
};

export function CommentView({ comment: inbound }: CommentViewProps) {
  const { replyingTo, setReplyingTo } = useContext(DiscussionContext);

  const [comment, setComment] = useState(inbound);

  const diff = Date.now() - new Date(comment.createdAt).getTime();
  const timeElapsed =
    diff < 10000
      ? "moments"
      : humanize(diff, {
          round: true,
          units: ["y", "mo", "w", "d", "h", "m"],
        });

  const isReplyingTo = replyingTo?.id === comment.id;
  const toggleUpvote = async () => {
    await client
      .post(comment.upvoted ? "/downvote" : "/upvote", {
        commentId: comment.id,
      })
      .then(() => {
        setComment((comment) => {
          return {
            ...comment,
            upvoteCount: comment.upvoted
              ? comment.upvoteCount - 1
              : comment.upvoteCount + 1,
            upvoted: !comment.upvoted,
          };
        });
      });
  };

  return (
    <div className="min-h-20 flex">
      <div className={"flex flex-col"}>
        <img
          src={comment.authorAvatarURL}
          className="rounded-full h-12 w-12 mr-3"
        />
        {comment.child ? (
          // It's a bit hacky, but ot works!
          <div
            className={
              "relative flex-1  self-center bg-lightGray w-[2px] mx-0 my-auto left-[-6px]"
            }
          />
        ) : (
          <></>
        )}
      </div>
      <div className={"flex-1 space-y-2 "}>
        <div
          className={(isReplyingTo ? "bg-lightGray " : "").concat(
            " rounded-md p-2"
          )}
        >
          <div className="space-x-1">
            <span className="font-semibold">{comment.authorName}</span>
            <span className="text-gray-400 text-sm">・ {timeElapsed} ago</span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="space-x-4 text-[#4B587C] text-sm font-semibold">
            <span>
              <button
                onClick={() => {
                  toggleUpvote();
                }}
              >
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
                {comment.upvoted ? "Downvote" : "Upvote"} ({comment.upvoteCount}
                )
              </button>
            </span>
            {!comment.parentId && !comment.child ? (
              <button
                onClick={() => {
                  setReplyingTo(isReplyingTo ? undefined : comment);
                }}
              >
                Reply
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className={"pt-8"}>
          {comment.child ? <CommentView comment={comment.child} /> : <></>}
        </div>
      </div>
    </div>
  );
}
