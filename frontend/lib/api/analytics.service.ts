import apiClient from './client';

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  getTransactionStats: async (days: number = 30) => {
    const response = await apiClient.get('/analytics/transactions', {
      params: { days },
    });
    return response.data;
  },

  getUserGrowth: async (days: number = 30) => {
    const response = await apiClient.get('/analytics/user-growth', {
      params: { days },
    });
    return response.data;
  },

  getCreditPerformance: async () => {
    const response = await apiClient.get('/analytics/credit-performance');
    return response.data;
  },

  getSavingsStats: async () => {
    const response = await apiClient.get('/analytics/savings');
    return response.data;
  },
};

