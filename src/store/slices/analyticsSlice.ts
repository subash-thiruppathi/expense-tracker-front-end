import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analytics.service';

interface SummaryMetrics {
  totalExpenses: number;
  totalAmount: number;
  pendingExpenses: number;
  approvedExpenses: number;
}

interface ExpensesByCategory {
  category: string;
  count: number;
  total: number;
}

interface ExpensesByStatus {
  status: string;
  count: number;
}

interface ApprovalTime {
  expense_id: number;
  avg_approval_time: string;
}

interface TopSpender {
  id: number;
  name: string;
  total_spent: number;
}

interface AnalyticsState {
  summary: SummaryMetrics | null;
  expensesByCategory: ExpensesByCategory[];
  expensesByStatus: ExpensesByStatus[];
  approvalTimes: ApprovalTime[];
  topSpenders: TopSpender[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  summary: null,
  expensesByCategory: [],
  expensesByStatus: [],
  approvalTimes: [],
  topSpenders: [],
  loading: false,
  error: null,
};

export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getSummary();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchExpensesByCategory = createAsyncThunk(
  'analytics/fetchExpensesByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getExpensesByCategory();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchExpensesByStatus = createAsyncThunk(
  'analytics/fetchExpensesByStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getExpensesByStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchApprovalTimes = createAsyncThunk(
  'analytics/fetchApprovalTimes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getApprovalTimes();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTopSpenders = createAsyncThunk(
  'analytics/fetchTopSpenders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTopSpenders();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action: PayloadAction<SummaryMetrics>) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpensesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByCategory.fulfilled, (state, action: PayloadAction<ExpensesByCategory[]>) => {
        state.loading = false;
        state.expensesByCategory = action.payload;
      })
      .addCase(fetchExpensesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpensesByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByStatus.fulfilled, (state, action: PayloadAction<ExpensesByStatus[]>) => {
        state.loading = false;
        state.expensesByStatus = action.payload;
      })
      .addCase(fetchExpensesByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchApprovalTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalTimes.fulfilled, (state, action: PayloadAction<ApprovalTime[]>) => {
        state.loading = false;
        state.approvalTimes = action.payload;
      })
      .addCase(fetchApprovalTimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopSpenders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSpenders.fulfilled, (state, action: PayloadAction<TopSpender[]>) => {
        state.loading = false;
        state.topSpenders = action.payload;
      })
      .addCase(fetchTopSpenders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;

export const selectAnalyticsSummary = (state: any) => state.analytics.summary;
export const selectExpensesByCategory = (state: any) => state.analytics.expensesByCategory;
export const selectExpensesByStatus = (state: any) => state.analytics.expensesByStatus;
export const selectApprovalTimes = (state: any) => state.analytics.approvalTimes;
export const selectTopSpenders = (state: any) => state.analytics.topSpenders;
export const selectAnalyticsLoading = (state: any) => state.analytics.loading;
export const selectAnalyticsError = (state: any) => state.analytics.error;

export default analyticsSlice.reducer;
