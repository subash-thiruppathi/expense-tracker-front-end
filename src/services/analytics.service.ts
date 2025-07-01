import api from './api';
import { AxiosResponse } from 'axios';

export const analyticsService = {
  getSummary: async () => {
    const response: AxiosResponse = await api.get('/analytics/summary');
    return response.data;
  },

  getExpensesByCategory: async () => {
    const response: AxiosResponse = await api.get('/analytics/expenses-by-category');
    console.log('Expenses by Category Response:', response);
    return response.data;
  },

  getExpensesByStatus: async () => {
    const response: AxiosResponse = await api.get('/analytics/expenses-by-status');
    return response.data;
  },

  getApprovalTimes: async () => {
    const response: AxiosResponse = await api.get('/analytics/approval-times');
    return response.data;
  },

  getTopSpenders: async () => {
    const response: AxiosResponse = await api.get('/analytics/top-spenders');
    return response.data;
  },
};
