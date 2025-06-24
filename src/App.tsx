import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Toast from './components/common/Toast';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import MyExpenses from './pages/MyExpenses';
import PendingApprovals from './pages/PendingApprovals';
import AllExpenses from './pages/AllExpenses';
import ExpenseDetails from './pages/ExpenseDetails';
import SubmitExpense from './pages/SubmitExpense';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import UserManagement from './pages/UserManagement';
import { ROUTES } from './utils/constants';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1976d2',
    colorSuccess: '#4caf50',
    colorWarning: '#ff9800',
    colorError: '#f44336',
    borderRadius: 6,
  },
};

// Component to initialize auth state
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginForm />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <ProtectedRoute requireAuth={false}>
              <RegisterForm />
            </ProtectedRoute>
          }
        />
        
        {/* Password reset routes */}
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute requireAuth={false}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path={ROUTES.MY_EXPENSES}
          element={
            <ProtectedRoute requiredRoles={['EMPLOYEE']}>
              <Layout>
                <MyExpenses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-expense"
          element={
            <ProtectedRoute requiredRoles={['EMPLOYEE']}>
              <Layout>
                <SubmitExpense />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PENDING_APPROVALS}
          element={
            <ProtectedRoute requiredRoles={['MANAGER', 'ACCOUNTANT', 'ADMIN']}>
              <Layout>
                <PendingApprovals />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ALL_EXPENSES}
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <Layout>
                <AllExpenses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expense/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Change password route */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* User management route (Admin only) */}
        <Route
          path="/user-management"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
      <Toast />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <AppContent />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
