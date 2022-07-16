import { initializeApp } from "firebase/app";
import { AddComment } from "./components/add-comment";
import { CommentContainer } from "./components/comment-container";

const firebaseConfig = {
  apiKey: "AIzaSyDTAmhqXd5GUWESIAi4pWAn5wiTEBenL94",
  authDomain: "ideal-octo-funicular.firebaseapp.com",
  projectId: "ideal-octo-funicular",
  storageBucket: "ideal-octo-funicular.appspot.com",
  messagingSenderId: "392618549283",
  appId: "1:392618549283:web:291b7622a1245316301196",
};
initializeApp(firebaseConfig);

function App() {
  return (
    <div className="h-screen">
      <div
        className={"flex h-full p-8 md:p-0 md:items-center md:justify-center"}
      >
        <div className="w-full max-w-3xl">
          <div className={"top-0 sticky"}>
            <div className="mb-8">
              <h1 className="text-xl font-semibold">Discussion</h1>
            </div>
            <AddComment />
          </div>
          <div className="border w-full border-lightGray my-32"></div>
          <CommentContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
