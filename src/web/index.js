/** @type {import("./scripts/jquery-3.6.0.min.js")} */
import mustache from "./scripts/mustache.js";

const upvoteCountTemplate = `<span data-count-commentid={{id}}>{{upvotes}}</span>`;

const upvoteButtonTemplate = `<svg class="inline mr-1" width="11" height="10" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.431818 7L4.14205 0.818182L7.84943 7H0.431818Z" fill="#4B587C"/>
</svg>
<span>Upvote (${upvoteCountTemplate})</span>`;

const downvoteButtonTemplate = ` <svg class="inline mr-1 rotate-180" width="11" height="10" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.431818 7L4.14205 0.818182L7.84943 7H0.431818Z" fill="#4B587C"/>
</svg>
<span>Downvote (${upvoteCountTemplate})</span>`;

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

          <button data-commentid="{{id}}" data-upvoted="{{upvoted}}" class="vote-btn" onclick='toggleUpvote("{{id}}")'}> 

          {{#upvoted?}}
            ${upvoteButtonTemplate}
          {{/upvoted?}}

          {{#upvoted}}
            ${downvoteButtonTemplate}
          {{/upvoted}}

            {{^upvoted}}
              ${upvoteButtonTemplate} 
            {{/upvoted}} 

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
  let userId = localStorage.getItem("userId");
  let upvotes = [];
  if (!userId) {
    console.log("...Getting new userId");
    $.get("https://www.uuidtools.com/api/generate/v4", (data) => {
      userId = data[0];
      localStorage.setItem("userId", userId);
      console.log(`Got it!`, userId);
    });
  }
  console.log("UserId", userId);

  const commentContainer = $("#comments-container");
  const commentForm = $("#comment-form");
  window.toggleUpvote = (commentId) => {
    const btn = $(`[data-commentid="${commentId}"]`);
    const upvoted = btn.attr("data-upvoted");

    if (upvoted === "true") {
      $.ajax({
        url: "http://localhost:8080/downvote",
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          commentId: commentId,
          userId: userId,
        }),

        success: (data) => {
          const upvoteIndx = upvotes.findIndex(
            (u) => u.commentId === commentId && u.userId === userId
          );
          if (upvoteIndx !== -1) {
            upvotes.splice(upvoteIndx, 1);
          }
          btn.attr("data-upvoted", false);

          btn.html(
            $(
              mustache.render(upvoteButtonTemplate, {
                upvotes: upvotes.filter((u) => u.commentId === commentId)
                  .length,
              })
            )
          );
        },
      });
    } else {
      $.post({
        url: "http://localhost:8080/upvote",
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          commentId: commentId,
          userId: userId,
        }),

        success: (data) => {
          upvotes.push(data.upvote);
          btn.attr("data-upvoted", true);
          btn.html(
            $(
              mustache.render(downvoteButtonTemplate, {
                upvotes: upvotes.filter((u) => u.commentId === commentId)
                  .length,
              })
            )
          );
        },
      });
    }
  };

  $(".vote-btn").on("click", (e) => {
    e.preventDefault();
    const el = $(e.target);
    alert("sSupupu");
  });

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

  function createCommentElement({
    id,
    image,
    name,
    text,
    upvotes,
    upvoted,
    date,
  }) {
    try {
      const element = $(
        mustache.render(commentTemplate, {
          image: image,
          name: name,
          text: text,
          upvotes: upvotes,
          dateAdded: date,
          upvoted: upvoted,
          id: id,
        })
      );

      return element;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function addCommentFromWeb(comment) {
    const difference = Date.now() - new Date(comment.dateAdded).getTime();

    console.log(upvotes, upvotes.findIndex((u) => u.userId === userId) !== -1);
    const element = createCommentElement({
      id: comment.id,
      image: comment.author.avatarURL,
      name: comment.author.name,
      text: comment.text,
      upvotes: upvotes.filter((u) => u.commentId === comment.id).length,
      upvoted:
        upvotes.findIndex(
          (u) => u.userId === userId && u.commentId === comment.id
        ) !== -1
          ? true
          : undefined,
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
    $.getJSON(`http://localhost:8080/comments`)
      .done((data) => {
        upvotes = data.upvotes;
        data.comments.forEach((comment) => addCommentFromWeb(comment));
      })
      .fail((error) => {});
  }

  loadComments();
})();
