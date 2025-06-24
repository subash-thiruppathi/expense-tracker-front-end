import { ExpenseStatus, UserRole } from '../types';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
export const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:3000';

export const EXPENSE_STATUSES: Record<ExpenseStatus, { color: string; label: string }> = {
  PENDING: { color: '#ffa500', label: 'Pending Manager Approval' },
  MANAGER_APPROVED: { color: '#87ceeb', label: 'Pending Accountant Approval' },
  ACCOUNTANT_APPROVED: { color: '#9370db', label: 'Pending Admin Approval' },
  FULLY_APPROVED: { color: '#32cd32', label: 'Fully Approved' },
  REJECTED: { color: '#dc143c', label: 'Rejected' },
};


export const USER_ROLES: Record<UserRole, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  ACCOUNTANT: 'Accountant',
  ADMIN: 'Admin'
};

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Software',
  'Training',
  'Marketing',
  'Utilities',
  'Other'
];

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MY_EXPENSES: '/my-expenses',
  PENDING_APPROVALS: '/pending-approvals',
  ALL_EXPENSES: '/all-expenses',
  EXPENSE_DETAILS: '/expense/:id'
};

export const STORAGE_KEYS = {
  TOKEN: 'expense_app_token',
  USER: 'expense_app_user'
};

export const QUERY_KEYS = {
  USER: 'user',
  MY_EXPENSES: 'myExpenses',
  PENDING_APPROVALS: 'pendingApprovals',
  ALL_EXPENSES: 'allExpenses',
  EXPENSE_DETAILS: 'expenseDetails'
};

export const APPROVAL_LEVELS: Record<UserRole, number> = {
  EMPLOYEE: 0,
  MANAGER: 1,
  ACCOUNTANT: 2,
  ADMIN: 3
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
