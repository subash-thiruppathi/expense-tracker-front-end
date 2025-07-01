import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import expenseSlice from './slices/expenseSlice';
import uiSlice from './slices/uiSlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    expenses: expenseSlice,
    ui: uiSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
