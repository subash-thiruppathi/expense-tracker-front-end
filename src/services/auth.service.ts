import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  OnboardUserData, 
  OnboardUserResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  ResetPasswordData,
  ChangePasswordData
} from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import apiService from './api';

class AuthService {
  private _currentUser: User | null = null;
  private _currentUserString: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    this._currentUser = response.user;
    this._currentUserString = JSON.stringify(response.user);
    
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    this._currentUser = response.user;
    this._currentUserString = JSON.stringify(response.user);
    
    return response;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this._currentUser = null;
    this._currentUserString = null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

    if (userStr) {
      if (userStr === this._currentUserString && this._currentUser) {
        return this._currentUser; // Return memoized object if string hasn't changed
      }
      try {
        const parsedUser = JSON.parse(userStr);
        this._currentUser = parsedUser;
        this._currentUserString = userStr;
        return parsedUser;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
        return null;
      }
    }
    this._currentUser = null;
    this._currentUserString = null;
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes(role as any) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.some(role => user.roles.includes(role as any));
  }

  // Admin-only user onboarding
  async onboardUser(userData: OnboardUserData): Promise<OnboardUserResponse> {
    return apiService.post<OnboardUserResponse>('/auth/onboard-user', userData);
  }

  // Get all users (Admin only)
  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/auth/users');
  }

  // Password reset request
  async requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    return apiService.post<PasswordResetResponse>('/auth/request-password-reset', data);
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/reset-password', data);
  }

  // Change password (authenticated users)
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/change-password', data);
  }

  // Register notification token (for push notifications)
  async registerNotificationToken(data: any): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('notifications/device-token', data);
  }
}

export const authService = new AuthService();
export default authService;
