export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
}

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ACCOUNTANT' | 'ADMIN';

export type ExpenseStatus = 
  | 'PENDING' 
  | 'MANAGER_APPROVED' 
  | 'ACCOUNTANT_APPROVED' 
  | 'FULLY_APPROVED' 
  | 'REJECTED';

// export interface Expense {
//   id: number;
//   title: string;
//   amount: number;
//   description: string;
//   category: string;
//   receipt_url?: string;
//   status: ExpenseStatus;
//   employee_id: number;
//   employee_name: string;
//   created_at: string;
//   updated_at: string;
//   approvals: Approval[];
// }

export interface Approval {
  id: number;
  expense_id: number;
  approver_id: number;
  approver_name: string;
  approver_role: UserRole;
  status: 'APPROVED' | 'REJECTED';
  remarks?: string;
  approved_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
}

export interface OnboardUserData {
  name: string;
  email: string;
  roles: UserRole[];
}

export interface OnboardUserResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
    temporary_password: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  reset_token?: string; // Only in development
  expires_at: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  description: string;
  category: string;
  receipt?: File;
}

export interface ApprovalData {
  status: 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  current_approval_level: number;
  description: string;
  category: string;
  receipt_url: string | null;
  createdAt: string;
  updatedAt: string;
  requested_by: number;
  status_id: number;
  requester: {
    name: string;
    email: string;
  };
  Approvals: any[];
}
