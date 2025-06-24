import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  toasts: ToastMessage[];
  loading: {
    global: boolean;
    expenses: boolean;
    auth: boolean;
  };
  modals: {
    expenseDetails: boolean;
    approvalModal: boolean;
  };
  filters: {
    status: string;
    category: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
}

const initialState: UIState = {
  toasts: [],
  loading: {
    global: false,
    expenses: false,
    auth: false,
  },
  modals: {
    expenseDetails: false,
    approvalModal: false,
  },
  filters: {
    status: '',
    category: '',
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const toast: ToastMessage = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.toasts.push(toast);
    },
    hideToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setExpensesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.expenses = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.auth = action.payload;
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        category: '',
        dateRange: {
          start: null,
          end: null,
        },
      };
    },
  },
});

export const {
  showToast,
  hideToast,
  clearAllToasts,
  setGlobalLoading,
  setExpensesLoading,
  setAuthLoading,
  openModal,
  closeModal,
  closeAllModals,
  setStatusFilter,
  setCategoryFilter,
  setDateRangeFilter,
  clearFilters,
} = uiSlice.actions;

// Selectors
export const selectToasts = (state: any) => state.ui.toasts;
export const selectLoading = (state: any) => state.ui.loading;
export const selectModals = (state: any) => state.ui.modals;
export const selectFilters = (state: any) => state.ui.filters;

export default uiSlice.reducer;
