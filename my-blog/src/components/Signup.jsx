import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Swal from "sweetalert2";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
} from "react-bootstrap";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const role =
      email.toLowerCase() === "ericsondalay@gmail.com" ? "admin" : "user";

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        full_name: fullName,
        email,
        role,
        created_at: new Date(),
      },
    ]);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    alert("Sign-up successful! Check your email for verification.");
    navigate("/");
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

  return (
    <>
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="lg"
        className="w-100"
        sticky="top"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/#"
            className="fw-bold fs-3 text-uppercase"
          >
            EMD Dev
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/projects">
                Projects
              </Nav.Link>
            </Nav>

            <div>
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline-light"
                  className="me-2"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-light"
                    className="me-2"
                  >
                    Login
                  </Button>
                  <Button as={Link} to="/signup" variant="success">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="shadow-lg p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    autoComplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100 mb-2">
                  Sign Up
                </Button>

                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => navigate("/")}
                >
                  Back
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;
