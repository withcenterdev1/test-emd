import React from "react";

const BlogDetails = ({ blog, onEdit, onBack }) => {
  if (!blog) return <p>Select a blog to view details.</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>

      {/* Display media if exists */}
      {blog.mediaURL && (
        <div>
          <h4>Media:</h4>
          {blog.mediaURL.includes("youtube") ? (
            <iframe
              width="560"
              height="315"
              src={blog.mediaURL}
              title="Media"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={blog.mediaURL}
              alt="Blog Media"
              style={{ width: "100%", maxHeight: "400px" }}
            />
          )}
        </div>
      )}

      {/* Display photo if exists */}
      {blog.photoURL && (
        <div>
          <h4>Photo:</h4>
          <img
            src={blog.photoURL}
            alt="Blog Photo"
            style={{ width: "100%", maxHeight: "300px" }}
          />
        </div>
      )}

      <button onClick={() => onEdit(blog)}>Edit</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default BlogDetails;
