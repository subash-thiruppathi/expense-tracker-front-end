import { Expense, ExpenseFormData, ApprovalData, ApiResponse, PaginatedResponse } from '../types';
import apiService from './api';

class ExpenseService {
  async createExpense(expenseData: ExpenseFormData): Promise<ApiResponse<Expense>> {
    const formData = new FormData();
    formData.append('title', expenseData.title);
    formData.append('amount', expenseData.amount.toString());
    formData.append('description', expenseData.description);
    formData.append('category', expenseData.category);
    
    if (expenseData.receipt) {
      formData.append('receipt', expenseData.receipt);
    }

    return apiService.uploadFile<ApiResponse<Expense>>('/expenses', formData);
  }

  async getMyExpenses(page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    const response = await apiService.get<PaginatedResponse<Expense>>(`/expenses/my?page=${page}&limit=${limit}`);
    console.log('My Expenses Response:', response);
    return response;
  }

  async getPendingApprovals(page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    const response = await apiService.get<PaginatedResponse<Expense>>(`/expenses/pending-approvals?page=${page}&limit=${limit}`);
    console.log('Pending Approvals Response:', response);
    return response;
  }

  async getAllExpenses(page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    return apiService.get<PaginatedResponse<Expense>>(`/expenses?page=${page}&limit=${limit}`);
  }

  async getExpenseById(id: number): Promise<Expense> {
    return apiService.get<Expense>(`/expenses/${id}`);
  }

  async approveExpense(id: number, approvalData: ApprovalData): Promise<ApiResponse<Expense>> {
    return apiService.post<ApiResponse<Expense>>(`/expenses/${id}/approve`, approvalData);
  }

  async getExpensesByStatus(status: string, page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    return apiService.get<PaginatedResponse<Expense>>(`/expenses?status=${status}&page=${page}&limit=${limit}`);
  }

  async getExpensesByDateRange(
    startDate: string, 
    endDate: string, 
    page = 1, 
    limit = 10
  ): Promise<PaginatedResponse<Expense>> {
    return apiService.get<PaginatedResponse<Expense>>(
      `/expenses?start_date=${startDate}&end_date=${endDate}&page=${page}&limit=${limit}`
    );
  }

  async getExpensesByCategory(category: string, page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    return apiService.get<PaginatedResponse<Expense>>(`/expenses?category=${category}&page=${page}&limit=${limit}`);
  }

  async searchExpenses(query: string, page = 1, limit = 10): Promise<PaginatedResponse<Expense>> {
    return apiService.get<PaginatedResponse<Expense>>(`/expenses?search=${query}&page=${page}&limit=${limit}`);
  }
}

export const expenseService = new ExpenseService();
export default expenseService;
