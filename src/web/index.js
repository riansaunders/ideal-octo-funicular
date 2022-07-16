/** @type {import("./scripts/jquery-3.6.0.min.js")} */
import mustache from "./scripts/mustache.js";

console.log(humanizeDuration);

const commentTemplate = `
  <div class="h-20 flex">
    <img src="{{image}}" class="rounded-full h-12 w-12 mr-3" />
    <div class="flex-1 space-y-2">
      <div class="space-x-1">
        <span class="font-semibold">{{name}}</span>
        <span class="text-gray-400 text-sm">・{{dateAdded}} ago</span>
      </div>
      <p class="text-sm">{{text}}</p>
      <div class="space-x-4 text-[#4B587C] text-sm font-semibold">
        <span>
          <button>

            <svg class="inline mr-1" width="11" height="10" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.431818 7L4.14205 0.818182L7.84943 7H0.431818Z" fill="#4B587C"/>
            </svg>
            Upvote

          </button>
        </span>
        <button>
          Reply
        </button>

      </div>
    </div>
  </div>
`;

$(function () {
  const commentContainer = $("#comments-container");
  const commentForm = $("#comment-form");

  commentForm.on("submit", (e) => {
    e.preventDefault();
    const commentInput = $("[name='comment']");

    if (!commentInput.val()) {
      alert("Please enter a comment :-)");
      return;
    }
    const comment = String(commentInput.val());

    $.ajax({
      url: "http://localhost:8080/comment",
      method: "POST",
      dataType: "json",
      data: JSON.stringify({
        text: comment,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      success: (data) => {
        addCommentFromWeb(data.comment);
        commentInput.val("");
      },
      fail: (error) => {},
    });
  });

  function createCommentElement({ image, name, text, upvotes, date }) {
    const element = $(
      mustache.render(commentTemplate, {
        image: image,
        name: name,
        text: text,
        upvotes: upvotes,
        dateAdded: date,
      })
    );

    return element;
  }

  function addCommentFromWeb(comment) {
    const difference = Date.now() - new Date(comment.dateAdded).getTime();

    const element = createCommentElement({
      image: comment.author.avatarURL,
      name: comment.author.name,
      text: comment.text,
      upvotes: comment.upvotes,
      date:
        difference < 10000
          ? "moments"
          : humanizeDuration(difference, {
              round: true,
              conjunction: " and ",
            }),
    });
    commentContainer.prepend(element);
    return element;
  }

  function loadComments() {
    $.getJSON("http://localhost:8080/comments")
      .done((data) => {
        console.log(data.comments);
        data.comments.forEach((comment) => addCommentFromWeb(comment));
      })
      .fail((error) => {});
  }

  loadComments();
})();
