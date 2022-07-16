import { useContext, useState } from "react";

import { mutate } from "swr";
import { DiscussionContext } from "../App";
import { client } from "../utils/http";

export function AddComment() {
  const [content, setContent] = useState("");

  const { replyingTo, setReplyingTo } = useContext(DiscussionContext);

  const submitForm = () => {
    client
      .post("/comment", {
        text: content,
        parent: replyingTo?.id,
      })
      .then(() => {
        mutate("/comments", undefined, { revalidate: true });
      });
    setReplyingTo(undefined);
    setContent("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <div className="flex space-x-3 items-center">
        <img
          alt="avatar"
          id="avatarImage"
          src="https://loremflickr.com/48/48"
          className="h-12 w-12 rounded-full"
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="h-full border border-lightGray flex-1 px-3 py-2 rounded-md placeholder:text-mediumGray"
          type="text"
          placeholder="What are your thoughts?"
        />
        <button
          type="submit"
          className="text-white font-semibold text-sm bg-[#7E34F6] py-2 px-4 rounded-md"
        >
          {replyingTo ? "Reply" : "Comment"}
        </button>
        {replyingTo ? (
          <button className="text-sm" onClick={() => setReplyingTo(undefined)}>
            Cancel
          </button>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
}
