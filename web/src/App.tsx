function App() {
  return (
    <div className="h-screen">
      <div
        className={"flex h-full p-8 md:p-0 md:items-center md:justify-center"}
      >
        <div className="w-full max-w-3xl">
          <div className="mb-8">
            <h1 className="text-xl font-semibold">Discussion</h1>
          </div>
          <form id="comment-form" method="POST">
            <div className="flex space-x-3 items-center">
              <img
                id="avatarImage"
                src="https://loremflickr.com/48/48"
                className="h-12 w-12 rounded-full"
              />
              <input
                name="comment"
                required
                className="h-full border border-lightGray flex-1 px-3 py-2 rounded-md placeholder:text-mediumGray"
                type="text"
                placeholder="What are your thoughts?"
              />
              <button
                type="submit"
                className="text-white font-semibold text-sm bg-[#7E34F6] py-2 px-4 rounded-md"
              >
                Comment
              </button>
            </div>
          </form>

          <div className="border w-full border-lightGray my-32"></div>

          <div id="comments-container" className="space-y-6"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
