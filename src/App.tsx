import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
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
import useNotifications from './hooks/useNotifications';
import AppInitializer from './components/AppInitializer';

import AppRoutes from './components/AppRoutes';
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



const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <AppRoutes />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
