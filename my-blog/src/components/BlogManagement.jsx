import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import Pagination from "@mui/material/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import {
  fetchBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../redux/blogSlice";
import {
  Table,
  Button,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  ListGroup,
  Card,
} from "react-bootstrap";
import { supabase } from "../services/supabaseClient";

const BlogManagement = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [show, setShow] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: "", content: "" });
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [mediaURL, setMediaURL] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBlogs());

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    setEditing(false);
    setCurrentBlog({ title: "", content: "" });
    setPhotoURL("");
    setMediaURL("");
  };

  const handleShow = (blog = { title: "", content: "" }) => {
    setCurrentBlog(blog);
    setEditing(!!blog.id);
    setShow(true);
    setPhotoURL(blog.photoURL || "");
    setMediaURL(blog.mediaURL || "");
  };

  const handleSave = async () => {
    if (!user || !user.id) {
      Swal.fire("Error!", "User not authenticated!", "error");
      return;
    }

    const blogData = {
      title: currentBlog.title,
      content: currentBlog.content,
      user_id: user.id,
      photoURL: photoURL,
      mediaURL: mediaURL,
    };

    if (editing) {
      dispatch(updateBlog({ id: currentBlog.id, blog: blogData }));
      Swal.fire(
        "Updated!",
        "The blog has been successfully updated!",
        "success"
      );
    } else {
      dispatch(addBlog(blogData));
      Swal.fire("Added!", "The blog has been successfully added!", "success");
    }

    handleClose();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBlog(id));
        Swal.fire("Deleted!", "The blog post has been deleted.", "success");
      }
    });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      Swal.fire("Logout", "You have successfully logged out.", "success").then(
        () => {
          navigate("/");
        }
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong during logout.", "error");
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/#"
            className="fw-bold fs-3 text-uppercase"
          >
            EMD Dev
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button as={Link} to="/signup" variant="success">
              Sign Up
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="mb-3">
          <Col>
            <h2 className="text-center">Manage Blogs</h2>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => handleShow()}>
              + Add Blog
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md={3} sm={12} className="mb-3">
            <Card className="shadow-lg">
              <Card.Header className="text-center">Admin Panel</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Link to="/Admin-Panel" className="text-decoration-none">
                    Dashboard
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to="/user-Management" className="text-decoration-none">
                    User Management
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to="/blog-Management" className="text-decoration-none">
                    Blog Management
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col>
            <Table striped bordered hover responsive className="shadow">
              <thead className="table-dark text-center">
                <tr>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Photo</th>
                  <th>Media</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.content}</td>
                      <td className="text-center">
                        {blog.photoURL ? (
                          <a
                            href={blog.photoURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Photo
                          </a>
                        ) : (
                          "No photo"
                        )}
                      </td>
                      <td className="text-center">
                        {blog.mediaURL ? (
                          <a
                            href={blog.mediaURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Media
                          </a>
                        ) : (
                          "No media"
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                          <BorderColorIcon
                            style={{ color: "blue" }}
                            onClick={() => handleShow(blog)}
                          />
                          <DeleteIcon
                            style={{ color: "red" }}
                            onClick={() => handleDelete(blog.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No blogs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div spacing={2} className="d-flex justify-content-end">
              <Pagination
                count={Math.ceil(blogs.length / blogsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </div>
          </Col>
        </Row>

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Blog" : "Add Blog"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title"
                  value={currentBlog.title}
                  required
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your blog content here..."
                  value={currentBlog.content}
                  required
                  onChange={(e) =>
                    setCurrentBlog({
                      ...currentBlog,
                      content: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Photo URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter photo URL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Media URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter media URL"
                  value={mediaURL}
                  onChange={(e) => setMediaURL(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editing ? "Update Blog" : "Save Blog"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default BlogManagement;
