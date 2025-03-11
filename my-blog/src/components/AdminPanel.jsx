import { useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCount } from "../redux/authSlice";
import { fetchBlogCount } from "../redux/blogSlice";
import Swal from "sweetalert2";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCount = useSelector((state) => state.auth.userCount);
  const blogCount = useSelector((state) => state.blogs.blogCount);

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

  useEffect(() => {
    dispatch(fetchUserCount());
    dispatch(fetchBlogCount());
  }, [dispatch]);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="w-100" sticky="top">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/#"
            className="fw-bold fs-3 text-uppercase"
          >
            EMD Dev
          </Navbar.Brand>
          <Nav className="me-auto"></Nav>

          <div>
            <Button
              onClick={handleLogout}
              variant="outline-light"
              className="me-2"
            >
              Logout
            </Button>
            <Button as={Link} to="/signup" variant="success">
              Sign Up
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container className="my-5">
        <Row>
          <Col md={3}>
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
          <Col md={9}>
            <Card className="shadow-lg">
              <Card.Header className="text-center bg-primary text-white">
                Blog Dashboard
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Card className="bg-secondary text-white">
                      <Card.Body>
                        <h5>Total Users</h5>
                        <p>{userCount}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-success text-white">
                      <Card.Body>
                        <h5>Active Posts</h5>
                        <p>{blogCount}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminPanel;
