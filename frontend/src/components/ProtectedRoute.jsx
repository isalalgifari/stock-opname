import { Navigate } from 'react-router-dom';
import { getRole } from '../utils/auth';

export default function ProtectedRoute({ children, allow }) {
  const role = getRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
