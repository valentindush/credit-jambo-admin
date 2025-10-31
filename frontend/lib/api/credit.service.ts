import apiClient from './client';

export interface Credit {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyPayment: number;
  totalRepayable: number;
  amountPaid: number;
  outstandingBalance: number;
  status: string;
  purpose?: string;
  creditScore?: number;
  approvedBy?: string;
  approvedAt?: string;
  disbursedAt?: string;
  dueDate?: string;
  nextPaymentDate?: string;
  rejectionReason?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreditStats {
  totalCredits: number;
  pendingCredits: number;
  approvedCredits: number;
  rejectedCredits: number;
  disbursedCredits: number;
  defaultedCredits: number;
}

export const creditService = {
  getPendingCredits: async (skip = 0, take = 10) => {
    const response = await apiClient.get('/credit/pending', {
      params: { skip, take },
    });
    return response.data;
  },

  getAllCredits: async (skip = 0, take = 10, status?: string) => {
    const response = await apiClient.get('/credit', {
      params: { skip, take, status },
    });
    return response.data;
  },

  getCreditById: async (id: string) => {
    const response = await apiClient.get(`/credit/${id}`);
    return response.data;
  },

  approveCredit: async (id: string, approvalData: any) => {
    const response = await apiClient.post(`/credit/${id}/approve`, approvalData);
    return response.data;
  },

  rejectCredit: async (id: string, rejectionData: any) => {
    const response = await apiClient.post(`/credit/${id}/reject`, rejectionData);
    return response.data;
  },

  getCreditStats: async (): Promise<CreditStats> => {
    const response = await apiClient.get('/credit/stats');
    return response.data;
  },
};

