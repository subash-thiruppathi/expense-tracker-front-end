import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData } from '../../types';
import authService from '../../services/auth.service';
import { showToast } from './uiSlice';
import apiService from '../../services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  notifications: any[]; // Adjust type as needed
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  notifications: [],
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      dispatch(showToast({ message: 'Login successful!', type: 'success' }));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      dispatch(showToast({ message: 'Registration successful!', type: 'success' }));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getNotifications = createAsyncThunk(
  'auth/getNotifications',
  async (_arg,{ dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.get('notifications');
      console.log('Notifications:', response);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    
    if (currentUser && token) {
      return { user: currentUser, token };
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && (!state.user || state.user.id !== action.payload.user.id)) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
      });
      // Get notifications cases
      builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {   
        state.loading = false;
        // Assuming action.payload contains the notifications
        console.log('Notifications fetched:', action.payload);
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch notifications:', state.error);
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Helper functions
export const hasRole = (state: { auth: AuthState }, role: string): boolean => {
  return authService.hasRole(role);
};

export const hasAnyRole = (state: { auth: AuthState }, roles: string[]): boolean => {
  return authService.hasAnyRole(roles);
};

// Selector functions for role checking
export const selectHasRole = (role: string) => (state: { auth: AuthState }): boolean => {
  return authService.hasRole(role);
};

export const selectHasAnyRole = (roles: string[]) => (state: { auth: AuthState }): boolean => {
  return authService.hasAnyRole(roles);
};

export default authSlice.reducer;
