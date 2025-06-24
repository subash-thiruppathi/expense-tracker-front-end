import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector } from '../../store/hooks';
import { selectIsAuthenticated, selectAuthLoading, hasAnyRole } from '../../store/slices/authSlice';
import { ROUTES } from '../../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuth = true,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const state = useAppSelector(state => state);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.warn('User is not authenticated and trying to access a protected route.',isAuthenticated);
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If specific roles are required but user doesn't have them
  if (requiredRoles.length > 0) {
    if (!hasAnyRole(state, requiredRoles)) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    console.warn('User is authenticated but trying to access a protected route without authentication requirement.');
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
