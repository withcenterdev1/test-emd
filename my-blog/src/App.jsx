import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserManagement from "./components/UserMangement";
import AdminPanel from "./components/AdminPanel";
import BlogManagement from "./components/BlogManagement";
import Unauthorized from "./components/UnAuthorized";
import ProtectedRoute from "./components/protectedRoutes";
import { loginSuccess } from "./redux/authSlice";
import { supabase } from "./services/supabaseClient";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: userData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (roleError || !userData) {
          console.error("Error fetching role:", roleError);
        } else {
          dispatch(loginSuccess({ user: session.user, role: userData.role }));
        }
      }
      setCheckingSession(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          (async () => {
            const { data: userData, error: roleError } = await supabase
              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .maybeSingle();

            if (roleError || !userData) {
              console.error("Error fetching role:", roleError);
              return;
            }

            dispatch(loginSuccess({ user: session.user, role: userData.role }));
          })();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (checkingSession) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* <Route element={<ProtectedRoute roleRequired="user" />}></Route> */}

        <Route element={<ProtectedRoute roleRequired="admin" />}>
          <Route path="/Admin-Panel" element={<AdminPanel />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/blog-management" element={<BlogManagement />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
