# Redux Store Implementation Guide

This document explains the Redux store implementation for the Expense Approval Application, including how to use Redux for state management and toast notifications.

## Overview

The application now uses Redux Toolkit for state management with the following features:
- **Authentication State Management**: Login, logout, user session
- **Expense State Management**: CRUD operations, filtering, pagination
- **UI State Management**: Toast notifications, loading states, modals
- **Toast Notifications**: Success, error, warning, and info messages

## Store Structure

```
src/store/
├── index.ts              # Store configuration
├── hooks.ts              # Typed Redux hooks
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── expenseSlice.ts   # Expense management state
    └── uiSlice.ts        # UI state and toast notifications
```

## Usage Examples

### 1. Authentication with Redux

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, selectAuthLoading, selectIsAuthenticated } from '../store/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Success toast is automatically shown
      // Navigate to dashboard
    } catch (error) {
      // Error toast is automatically shown
    }
  };
};
```

### 2. Expense Management with Redux

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  createExpense, 
  fetchMyExpenses, 
  selectMyExpenses, 
  selectExpensesLoading 
} from '../store/slices/expenseSlice';

const ExpenseComponent = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectMyExpenses);
  const loading = useAppSelector(selectExpensesLoading);

  // Create expense
  const handleCreateExpense = async (expenseData) => {
    try {
      await dispatch(createExpense(expenseData)).unwrap();
      // Success toast automatically shown
    } catch (error) {
      // Error toast automatically shown
    }
  };

  // Fetch expenses
  useEffect(() => {
    dispatch(fetchMyExpenses({ page: 1, limit: 10 }));
  }, [dispatch]);
};
```

### 3. Toast Notifications

```typescript
import { useAppDispatch } from '../store/hooks';
import { showToast } from '../store/slices/uiSlice';

const Component = () => {
  const dispatch = useAppDispatch();

  // Show different types of toast messages
  const showSuccessToast = () => {
    dispatch(showToast({ 
      message: 'Operation completed successfully!', 
      type: 'success' 
    }));
  };

  const showErrorToast = () => {
    dispatch(showToast({ 
      message: 'Something went wrong!', 
      type: 'error' 
    }));
  };

  const showWarningToast = () => {
    dispatch(showToast({ 
      message: 'Please check your input!', 
      type: 'warning' 
    }));
  };

  const showInfoToast = () => {
    dispatch(showToast({ 
      message: 'Here is some information', 
      type: 'info',
      duration: 3000 // Custom duration
    }));
  };
};
```

## Available Actions

### Auth Slice Actions
- `loginUser(credentials)` - Login user
- `registerUser(userData)` - Register new user
- `logout()` - Logout user
- `initializeAuth()` - Initialize auth state from localStorage
- `clearError()` - Clear auth errors

### Expense Slice Actions
- `createExpense(expenseData)` - Create new expense
- `fetchMyExpenses({ page, limit })` - Fetch user's expenses
- `fetchPendingApprovals({ page, limit })` - Fetch pending approvals
- `fetchAllExpenses({ page, limit })` - Fetch all expenses (admin)
- `fetchExpenseById(id)` - Fetch single expense
- `approveExpense({ id, approvalData })` - Approve/reject expense
- `searchExpenses({ query, page, limit })` - Search expenses

### UI Slice Actions
- `showToast({ message, type, duration? })` - Show toast notification
- `hideToast(id)` - Hide specific toast
- `clearAllToasts()` - Clear all toasts
- `setGlobalLoading(boolean)` - Set global loading state
- `openModal(modalName)` - Open modal
- `closeModal(modalName)` - Close modal

## Available Selectors

### Auth Selectors
- `selectAuth` - Complete auth state
- `selectUser` - Current user
- `selectIsAuthenticated` - Authentication status
- `selectAuthLoading` - Auth loading state
- `selectAuthError` - Auth error state

### Expense Selectors
- `selectMyExpenses` - User's expenses
- `selectPendingApprovals` - Pending approvals
- `selectAllExpenses` - All expenses
- `selectCurrentExpense` - Currently selected expense
- `selectExpensesLoading` - Expenses loading state
- `selectExpensesPagination` - Pagination info

### UI Selectors
- `selectToasts` - Active toast messages
- `selectLoading` - Loading states
- `selectModals` - Modal states

## Toast Component

The `Toast` component is automatically included in the app and handles displaying toast notifications from the Redux store. It uses `react-toastify` for the UI.

### Features:
- Automatic toast display from Redux state
- Different toast types (success, error, warning, info)
- Customizable duration
- Auto-dismiss functionality
- Click to dismiss
- Drag to dismiss

## Migration from Context API

If you're migrating from the existing AuthContext:

1. **Replace useAuth hook calls**:
   ```typescript
   // Old
   const { user, login, logout } = useAuth();
   
   // New
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const handleLogin = (credentials) => dispatch(loginUser(credentials));
   const handleLogout = () => dispatch(logout());
   ```

2. **Replace direct API calls**:
   ```typescript
   // Old
   const result = await expenseService.createExpense(data);
   
   // New
   await dispatch(createExpense(data)).unwrap();
   ```

3. **Replace Ant Design message calls**:
   ```typescript
   // Old
   message.success('Success!');
   
   // New
   dispatch(showToast({ message: 'Success!', type: 'success' }));
   ```

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of the generic Redux hooks.

2. **Handle async actions properly**: Use `.unwrap()` to handle promise resolution/rejection:
   ```typescript
   try {
     await dispatch(asyncAction(data)).unwrap();
     // Handle success
   } catch (error) {
     // Handle error
   }
   ```

3. **Use selectors**: Create and use selectors for accessing state to maintain consistency.

4. **Toast notifications**: Let Redux actions handle toast notifications automatically for consistent UX.

5. **Error handling**: Errors are automatically handled in Redux slices with toast notifications.

## Dependencies Added

- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `react-toastify` - Toast notification library

## File Changes Made

1. **New files created**:
   - `src/store/index.ts`
   - `src/store/hooks.ts`
   - `src/store/slices/authSlice.ts`
   - `src/store/slices/expenseSlice.ts`
   - `src/store/slices/uiSlice.ts`
   - `src/components/common/Toast.tsx`

2. **Modified files**:
   - `src/App.tsx` - Added Redux Provider and Toast component
   - `src/components/auth/LoginForm.tsx` - Updated to use Redux
   - `src/pages/SubmitExpense.tsx` - Updated to use Redux

## Next Steps

To fully migrate the application to Redux:

1. Update remaining components to use Redux instead of AuthContext
2. Update all pages to use Redux for expense management
3. Remove React Query dependencies if no longer needed
4. Update ProtectedRoute component to use Redux auth state
5. Update Header and Sidebar components to use Redux state

The Redux implementation provides a more scalable and maintainable state management solution with built-in toast notifications for better user experience.
