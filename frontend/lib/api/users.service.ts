import apiClient from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status: string;
  emailVerified: boolean;
  kycVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  pendingVerification: number;
}

export const usersService = {
  getAllUsers: async (skip = 0, take = 10, search?: string) => {
    const response = await apiClient.get('/users', {
      params: { skip, take, search },
    });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/users/${id}/status`, { status });
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },
};

