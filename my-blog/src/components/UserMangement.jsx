import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  Navbar,
  Nav,
  Table,
  Button,
  Container,
  Col,
  Card,
  ListGroup,
  Row,
  Modal,
  Form,
} from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_deleted", false);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentPage > Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(Math.max(1, Math.ceil(users.length / usersPerPage)));
    }
  }, [users, usersPerPage, currentPage]);

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("users")
        .update({ is_deleted: true })
        .eq("id", userId);

      if (error) {
        Swal.fire(
          "Error!",
          "Something went wrong while deleting: " + error.message,
          "error"
        );
      } else {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setCurrentPage(
          Math.max(1, Math.ceil(updatedUsers.length / usersPerPage))
        );

        Swal.fire(
          "Deleted!",
          "The user has been successfully deleted.",
          "success"
        );
      }
    }
  };

  const handleShowAddModal = () => {
    setFormData({ full_name: "", email: "", password: "", role: "user" });
    setShowAddModal(true);
  };

  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const { email, password, full_name, role } = formData;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    });

    if (error) {
      Swal.fire(
        "Error!",
        "Something went wrong during sign-up: " + error.message,
        "error"
      );
      return;
    }

    const { data, error: insertError } = await supabase
      .from("users")
      .insert([formData])
      .select("*");

    if (insertError) {
      Swal.fire(
        "Error!",
        "Something went wrong while adding: " + insertError.message,
        "error"
      );
    } else {
      setUsers([...users, ...data]);
      handleCloseModals();
      Swal.fire("Success!", "User has been successfully added.", "success");
    }
  };

  const handleEditUser = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password ? formData.password : undefined,
        role: formData.role,
      })
      .eq("id", selectedUser.id);

    if (error) {
      Swal.fire(
        "Error!",
        "Something went wrong while updating: " + error.message,
        "error"
      );
    } else {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      );
      handleCloseModals();
      Swal.fire("Updated!", "User has been successfully updated.", "success");
    }
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

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
                  <Link to="/admin-Panel" className="text-decoration-none">
                    Dashboard
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col xs={12} md={9}>
            <h2 className="mb-4">User Management</h2>
            <Button
              size="sm"
              variant="primary"
              className="mb-3"
              onClick={handleShowAddModal}
            >
              Add User
            </Button>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <BorderColorIcon
                        style={{ color: "blue" }}
                        className="me-2"
                        onClick={() => handleShowEditModal(user)}
                      />

                      <DeleteIcon
                        style={{ color: "red" }}
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div spacing={2} className="d-flex justify-content-end">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showAddModal || showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>{showAddModal ? "Add User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.full_name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                required="true"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={showAddModal ? handleAddUser : handleEditUser}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
