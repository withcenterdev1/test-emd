import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  Ratio,
  Carousel,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/blogSlice";
import { HashLink as Link } from "react-router-hash-link";
import { supabase } from "../services/supabaseClient";
import { Button, Paper } from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="shadow"
        sticky="top"
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand
            as={Link}
            to="/#"
            className="fw-bold fs-3 text-uppercase"
          >
            EMD Dev
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="text-white" as={Link} to="/#">
                Home
              </Nav.Link>
              <Nav.Link className="text-white" as={Link} to="/#blog-articles">
                Blog Articles
              </Nav.Link>
              <Nav.Link className="text-white" as={Link} to="/#About">
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div>
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outlined"
                className="me-2"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outlined"
                  className="me-2"
                >
                  Login
                </Button>
                <Button as={Link} to="/signup" variant="outlined">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Container>
      </Navbar>

      <Container className="Carousel">
        <Row>
          <Col md={6} className="my-lg-auto mt-md-5">
            <Carousel data-bs-theme="dark" className="shadow rounded">
              {blogs.length > 0 ? (
                blogs.slice(0, 3).map((blog, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 img-fluid rounded"
                      src={
                        blog.photoURL ||
                        "https://source.unsplash.com/800x400/?technology,coding"
                      }
                      alt={blog.title}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100 img-fluid rounded"
                    src="https://source.unsplash.com/800x400/?technology,coding"
                    alt="Placeholder"
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </Col>

          <Col md={6} className="pl-md-5 py-lg-5 my-auto">
            <p className="mb-0">Tech, Programming, & Development</p>
            <h1 className="mt-2 text-md-left">Explore the Latest in Tech!</h1>
            <p>
              Dive into insightful articles on software development, emerging
              technologies, and best coding practices. Our curated blog content
              is designed to keep you updated and inspired in your tech journey.
            </p>
            <Link to="/#blog-articles" className="btn btn-primary">
              Read Blogs
            </Link>
          </Col>
        </Row>
      </Container>

      <Container className="Articles">
        <h2 id="blog-articles" className="mb-4">
          📢 Blog Articles
        </h2>
        <Paper className="p-3 border border-2">
          <Row>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} dispatch={dispatch} />
              ))
            ) : (
              <p>No blogs available.</p>
            )}
          </Row>
        </Paper>
      </Container>

      <Container id="About" className="About text-center py-5 mt-4">
        <h2 className="mb-3 fw-bold fs-3 text-uppercase">🙌 About EMD DEV</h2>
        <p>
          EMD Dev is a blog dedicated to sharing insights about technology,
          programming, and software development. Our goal is to provide valuable
          content that helps developers stay updated and improve their skills.
        </p>
      </Container>
    </div>
  );
}

function BlogCard({ blog }) {
  const [likes, setLikes] = useState(blog.likes || 0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("likes")
        .eq("id", blog.id)
        .single();

      if (!error && data) {
        setLikes(data.likes);
      }
    };

    fetchLikes();
  }, [blog.id]);

  const handleLike = async () => {
    const newLikes = likes + 1;
    const { error } = await supabase
      .from("blogs")
      .update({ likes: newLikes })
      .eq("id", blog.id);

    if (!error) {
      setLikes(newLikes);
    }
  };

  return (
    <Col sm={12} md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-sm rounded overflow-hidden">
        {blog.mediaURL ? (
          <Ratio aspectRatio="16x9">
            <iframe
              src={`https://www.youtube.com/embed/${
                blog.mediaURL.split("&")[0]
              }`}
              title={blog.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Ratio>
        ) : (
          <Card.Img
            variant="top"
            src={
              blog.photoURL ||
              "https://source.unsplash.com/400x250/?technology,coding"
            }
            alt={blog.title}
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Text>
            {expanded ? blog.content : `${blog.content.substring(0, 100)}...`}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Button onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show Less" : "Read More"}
            </Button>
            <Button variant="outlined" color="primary" onClick={handleLike}>
              <ThumbUp /> {likes}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default HomePage;
