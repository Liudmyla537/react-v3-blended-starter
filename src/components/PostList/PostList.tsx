import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  toggleModal?: () => void;
}

export default function PostList({ posts, handleEdit, toggleModal }: PostListProps) {
  const queryClient = useQueryClient();
  const delMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post deleted successfully!");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const handleDelete = (id: number) => {
    // console.log("Delete", id);

    delMutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              onClick={() => {
                handleEdit(post);
                toggleModal?.();
              }}
              className={css.edit}
            >
              Edit
            </button>
            <button
              className={css.delete}
              onClick={() => {
                handleDelete(post.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
