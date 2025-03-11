import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

<Navbar bg="dark" data-bs-theme="dark" className="w-100" sticky="top">
  <Container>
    <Navbar.Brand as={Link} to="/#" className="fw-bold fs-3 text-uppercase">
      EMD Dev
    </Navbar.Brand>
    <Nav className="me-auto"></Nav>

    <Button as={Link} to="/signup" variant="success">
      Sign Up
    </Button>
  </Container>
</Navbar>;

const UnAuthorized = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h2>You are not authorized to view this page</h2>
      <p>Please contact your administrator if you believe this is a mistake.</p>
      <Link to="/">Go back to Login</Link>
    </div>
  );
};

export default UnAuthorized;
