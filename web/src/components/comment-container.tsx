import useSWR from "swr";
import { client } from "../utils/http";
import { CommentModel } from "../utils/types";
import { CommentView } from "./comment";

export function CommentContainer() {
  const { data: comments } = useSWR<CommentModel[]>(
    "/comments",
    (url) => client.get(url).then((r) => r.data.comments),
    {
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
  );

  return (
    <div className="space-y-6 overflow-y-auto">
      {comments?.length ? (
        comments?.map((c) => <CommentView comment={c} />)
      ) : (
        <></>
      )}
    </div>
  );
}
