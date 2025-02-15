import { Navigate } from "react-router-dom";
export default function RouteGuard({ children }) {
  const hasJWT = () => {
    let flag = true;
    localStorage.getItem("token") ? (flag = true) : (flag = false);
    return flag;
  };

  if (!hasJWT()) {
    return <Navigate to="/signup" replace />;
  }
  return <>{children}</>;
}
