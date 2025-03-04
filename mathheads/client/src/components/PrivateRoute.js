// client/src/components/PrivateRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from ".././context/auth/authContext";

// Component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  // If not authenticated or still loading, redirect to login
  // Otherwise, render the protected component
  return isAuthenticated && !loading ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
