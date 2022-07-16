/** @type {import("./scripts/jquery-3.6.0.min.js")} */
import mustache from "./scripts/mustache.js";

const commentTemplate = `
  <div class="h-20 flex">
    <img src="{{image}}" />
    <div class="flex-1 space-y-2">
      <div class="space-x-1">
        <span class="font-semibold">{{name}}</span>
        <span class="text-gray-400 text-sm">・45 min ago</span>
      </div>
      <p class="text-sm">{{text}}</p>
    </div>
  </div>
`;

$(function () {
  const commentContainer = $("#comments-container");
  const commentForm = $("#comment-form");

  commentForm.on("submit", (e) => {
    e.preventDefault();
    const { comment } = commentForm.serializeArray();
    if (!comment) {
      alert("Please enter a comment :-)");
      return;
    }
    $.post(
      "http://localhost:8080/comment",
      {
        //
      },
      (success) => {
        //
      }
    );
  });

  function addComment({ image, name, text, upvotes }) {
    const element = $(
      mustache.render(commentTemplate, {
        image: image,
        name: name,
        text: text,
        upvotes: upvotes,
      })
    );

    commentContainer.append(element);
    return element;
  }

  function loadComments() {
    $.getJSON("http://localhost:8080/comments")
      .done((data) => {
        console.log(data.comments);
        data.comments.forEach((comment) => {
          addComment({
            image: comment.author.imageURL,
            name: comment.author.name,
            text: comment.text,
            upvotes: comment.upvotes,
          });
        });
      })
      .fail((error) => {
        //
      });
  }

  loadComments();
})();
