import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal/Modal";
import { ChangeEvent, useState } from "react";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { fetchPosts } from "../../services/postService";
import { useDebouncedCallback } from "use-debounce";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";
import CreatePostForm from "../CreatePostForm/CreatePostForm";

const LIMIT = 10;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage, LIMIT),
  });

  // console.log(data);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value);
    setSearchQuery(event.target.value);
  }, 1000);

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / LIMIT) : 0;

  const handleEdit = (post: Post) => {
    // console.log(post);
    setEditedPost(post);
    setIsEditPost(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditedPost(null);
    setIsEditPost(false);
    setIsModalOpen(false);
    setIsCreatePost(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChange} />

        <button className={css.button} onClick={() => setIsCreatePost(!isCreatePost)}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {isEditPost && editedPost && (
            <EditPostForm initialValues={editedPost} onClose={handleCloseModal} />
          )}
        </Modal>
      )}
      {isCreatePost && (
        <Modal onClose={() => setIsCreatePost(!isCreatePost)}>
          <CreatePostForm onCancel={() => setIsCreatePost(!isCreatePost)} />
        </Modal>
      )}

      {data && data?.posts.length > 0 && <PostList posts={data.posts} handleEdit={handleEdit} />}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
