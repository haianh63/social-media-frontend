import { Navigate } from "react-router-dom";
import { hasJWT } from "../../utils";
export default function RouteGuard({ children }) {
  if (!hasJWT()) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}
