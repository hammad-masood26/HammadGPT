// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PrivateRouteProps = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, initialized } = useAuth();

  // Wait until AuthContext finishes loading from localStorage
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    ); // or a spinner
  }

  // Redirect to landing page if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return children;
}
