import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Form, Button, Container, Card, Nav, Navbar } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { logout } from "../redux/authSlice";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.user) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: loginError ? loginError.message : "User not found!",
      });
      return;
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (roleError || !userData) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: roleError ? roleError.message : "User record not found!",
      });
      return;
    }

    if (!userData) {
      setError("User record not found in the database.");
      return;
    }

    dispatch(login({ email, userId: data.user.id, role: userData.role }));

    Swal.fire({
      icon: "success",
      title: `Welcome, ${email}!`,
      text: `You have successfully logged in as ${userData.role}.`,
      showConfirmButton: true,
    });

    if (userData.role.toLowerCase() === "admin") {
      navigate("/Admin-Panel");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      await dispatch(logout()).unwrap();
      navigate("/");

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
      });
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

      <Container
        fluid
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{
          backgroundImage: `url("https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {error && <p className="text-danger">{error}</p>}
        <Card
          className="card-login d-flex justify-content-center align-items-center text-center p-4"
          style={{
            minHeight: "50vh",
            height: "auto",
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <div className="w-100 px-4">
            <h2 className="text-center mb-4">Login</h2>
            <Form
              onSubmit={handleSubmit}
              className="d-flex flex-column align-items-center w-100"
            >
              <Form.Group className="mb-3 w-100">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                  className="text-center"
                />
              </Form.Group>

              <Form.Group className="mb-3 w-100">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="text-center"
                />
              </Form.Group>

              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary text-decoration-none"
                >
                  Register
                </Link>
              </p>

              <div className="d-flex justify-content-center w-100">
                <Button
                  variant="success"
                  type="submit"
                  className="m-2 px-4 py-2"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/"
                  variant="secondary"
                  className="m-2 px-4 py-2"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Login;
