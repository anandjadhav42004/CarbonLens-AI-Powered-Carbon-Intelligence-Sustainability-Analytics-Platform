import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    // Save attempted URL or let them log in
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Show restriction toast
    toast.error('Access Restricted. Curator admin privileges required.');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
