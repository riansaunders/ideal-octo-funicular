import { initializeApp } from "firebase/app";
import { createContext, useState } from "react";
import { AddComment } from "./components/add-comment";
import { CommentsContainer } from "./components/comments-container";
import { CommentModel } from "./utils/types";

const firebaseConfig = {
  apiKey: "AIzaSyDTAmhqXd5GUWESIAi4pWAn5wiTEBenL94",
  authDomain: "ideal-octo-funicular.firebaseapp.com",
  projectId: "ideal-octo-funicular",
  storageBucket: "ideal-octo-funicular.appspot.com",
  messagingSenderId: "392618549283",
  appId: "1:392618549283:web:291b7622a1245316301196",
};
initializeApp(firebaseConfig);

type DiscussionContextProps = {
  replyingTo?: CommentModel;
  setReplyingTo: (comment: CommentModel | undefined) => void;
};
export const DiscussionContext = createContext<DiscussionContextProps>({
  replyingTo: undefined,
  setReplyingTo: (_) => {},
});

function App() {
  const [replyingTo, setReplyingTo] = useState<CommentModel | undefined>(
    undefined
  );

  return (
    <DiscussionContext.Provider
      value={{
        replyingTo: replyingTo,
        setReplyingTo: setReplyingTo,
      }}
    >
      <div className="">
        <div className={"flex p-8 md:p-0 md:items-center md:justify-center"}>
          <div className="w-full max-w-3xl flex flex-col">
            <div className={"sticky top-0  bg-white z-30  "}>
              <div className="mb-8">
                <h1 className="text-xl font-semibold">Discussion</h1>
              </div>
              <AddComment />
            </div>
            <div className="border w-full border-lightGray my-32"></div>
            <div className={"flex-1 overflow-y-auto"}>
              <CommentsContainer />
            </div>
          </div>
        </div>
      </div>
    </DiscussionContext.Provider>
  );
}

export default App;
