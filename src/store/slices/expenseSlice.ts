import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseFormData, ApprovalData } from '../../types';
import expenseService from '../../services/expense.service';
import { showToast } from './uiSlice';

interface ExpenseState {
  expenses: Expense[];
  myExpenses: Expense[];
  pendingApprovals: Expense[];
  allExpenses: Expense[];
  currentExpense: Expense | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  filters: {
    status: string;
    category: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
    search: string;
  };
}

const initialState: ExpenseState = {
  expenses: [],
  myExpenses: [],
  pendingApprovals: [],
  allExpenses: [],
  currentExpense: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  filters: {
    status: '',
    category: '',
    dateRange: {
      start: null,
      end: null,
    },
    search: '',
  },
};

// Async thunks
export const createExpense = createAsyncThunk(
  'expenses/create',
  async (expenseData: ExpenseFormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      dispatch(showToast({ message: 'Expense created successfully!', type: 'success' }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create expense';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMyExpenses = createAsyncThunk(
  'expenses/fetchMy',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getMyExpenses(page, limit);
      console.log('Fetched my expenses:', response);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch expenses';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPendingApprovals = createAsyncThunk(
  'expenses/fetchPendingApprovals',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getPendingApprovals(page, limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch pending approvals';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getAllExpenses(page, limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch all expenses';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchById',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenseById(id);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch expense details';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const approveExpense = createAsyncThunk(
  'expenses/approve',
  async ({ id, approvalData }: { id: number; approvalData: ApprovalData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.approveExpense(id, approvalData);
      const message = approvalData.status === 'APPROVED' ? 'Expense approved successfully!' : 'Expense rejected successfully!';
      dispatch(showToast({ message, type: 'success' }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to process approval';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchExpensesByStatus = createAsyncThunk(
  'expenses/fetchByStatus',
  async ({ status, page = 1, limit = 10 }: { status: string; page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getExpensesByStatus(status, page, limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch expenses by status';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchExpensesByCategory = createAsyncThunk(
  'expenses/fetchByCategory',
  async ({ category, page = 1, limit = 10 }: { category: string; page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.getExpensesByCategory(category, page, limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch expenses by category';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchExpenses = createAsyncThunk(
  'expenses/search',
  async ({ query, page = 1, limit = 10 }: { query: string; page?: number; limit?: number }, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.searchExpenses(query, page, limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to search expenses';
      dispatch(showToast({ message: errorMessage, type: 'error' }));
      return rejectWithValue(errorMessage);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentExpense: (state, action: PayloadAction<Expense | null>) => {
      state.currentExpense = action.payload;
    },
    updateExpenseInList: (state, action: PayloadAction<Expense>) => {
      const updatedExpense = action.payload;
      
      // Update in all relevant arrays
      const updateInArray = (array: Expense[]) => {
        const index = array.findIndex(expense => expense.id === updatedExpense.id);
        if (index !== -1) {
          array[index] = updatedExpense;
        }
      };

      updateInArray(state.expenses);
      updateInArray(state.myExpenses);
      updateInArray(state.pendingApprovals);
      updateInArray(state.allExpenses);

      if (state.currentExpense?.id === updatedExpense.id) {
        state.currentExpense = updatedExpense;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<ExpenseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        category: '',
        dateRange: {
          start: null,
          end: null,
        },
        search: '',
      };
    },
    setPagination: (state, action: PayloadAction<Partial<ExpenseState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create expense cases
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.myExpenses.unshift(action.payload);
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch my expenses cases
      .addCase(fetchMyExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyExpenses.fulfilled, (state, action) => {
        console.log('Fetched my expenses:', action.payload);
        state.loading = false;
        state.myExpenses = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchMyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch pending approvals cases
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApprovals = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch all expenses cases
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.allExpenses = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch expense by ID cases
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpense = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve expense cases
      .addCase(approveExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        state.loading = false;
        const updatedExpense = action.payload;
        
        // Update in all relevant arrays
        const updateInArray = (array: Expense[]) => {
          const index = array.findIndex(expense => expense.id === updatedExpense.id);
          if (index !== -1) {
            array[index] = updatedExpense;
          }
        };

        updateInArray(state.expenses);
        updateInArray(state.myExpenses);
        updateInArray(state.pendingApprovals);
        updateInArray(state.allExpenses);

        if (state.currentExpense?.id === updatedExpense.id) {
          state.currentExpense = updatedExpense;
        }
      })
      .addCase(approveExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search expenses cases
      .addCase(searchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(searchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentExpense,
  updateExpenseInList,
  setFilters,
  clearFilters,
  setPagination,
} = expenseSlice.actions;

// Selectors
export const selectExpenses = (state: { expenses: ExpenseState }) => state.expenses.expenses;
export const selectMyExpenses = (state: { expenses: ExpenseState }) => state.expenses.myExpenses;
export const selectPendingApprovals = (state: { expenses: ExpenseState }) => state.expenses.pendingApprovals;
export const selectAllExpenses = (state: { expenses: ExpenseState }) => state.expenses.allExpenses;
export const selectCurrentExpense = (state: { expenses: ExpenseState }) => state.expenses.currentExpense;
export const selectExpensesLoading = (state: { expenses: ExpenseState }) => state.expenses.loading;
export const selectExpensesError = (state: { expenses: ExpenseState }) => state.expenses.error;
export const selectExpensesPagination = (state: { expenses: ExpenseState }) => state.expenses.pagination;
export const selectExpensesFilters = (state: { expenses: ExpenseState }) => state.expenses.filters;

export default expenseSlice.reducer;
