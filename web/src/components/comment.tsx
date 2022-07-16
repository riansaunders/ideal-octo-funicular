{
  /* <div class="h-20 flex">
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
</div> */
}

export function Comment() {
  return <></>;
}
