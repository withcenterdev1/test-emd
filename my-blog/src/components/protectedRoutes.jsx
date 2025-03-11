import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ roleRequired }) => {
  const { role } = useSelector((state) => state.auth);

  return role && role.toLowerCase() === roleRequired.toLowerCase() ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedRoute;
