import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog, updateBlog } from "../redux/blogSlice";

const BlogForm = ({ blogToEdit, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [content, setContent] = useState(blogToEdit?.content || "");
  const [mediaURL, setMediaURL] = useState(blogToEdit?.mediaURL || "");
  const [photoURL, setPhotoURL] = useState(blogToEdit?.photoURL || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = { title, content, mediaURL, photoURL };

    if (blogToEdit) {
      dispatch(updateBlog({ id: blogToEdit.id, blog: blogData }));
    } else {
      dispatch(addBlog(blogData));
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{blogToEdit ? "Edit Blog" : "New Blog"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Media URL (e.g., video/image URL)"
        value={mediaURL}
        onChange={(e) => setMediaURL(e.target.value)}
      />
      <input
        type="text"
        placeholder="Photo URL (optional)"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
      />
      <button type="submit">{blogToEdit ? "Update" : "Create"}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default BlogForm;
