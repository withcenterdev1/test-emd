import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBlog } from "../redux/blogSlice";

const BlogTable = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  return (
    <div>
      <h2>Blog Table</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Photo URL</th>
            <th>Video ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.content.substring(0, 50)}...</td>
              <td>
                {blog.photoURL ? (
                  <img
                    src={blog.photoURL}
                    alt="Blog Thumbnail"
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  "No photo available"
                )}
              </td>
              <td>{blog.videoId}</td>
              <td>
                <button onClick={() => dispatch(deleteBlog(blog.id))}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
