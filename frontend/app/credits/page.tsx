'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { creditService } from '@/lib/api/credit.service';
import { useAuthStore } from '@/lib/store/auth.store';
import AdminLayout from '@/components/AdminLayout';

export default function CreditsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('PENDING');
  const take = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCredits = async () => {
      try {
        const data = await creditService.getAllCredits(skip, take, status);
        setCredits(data.data);
        setTotal(data.total);
      } catch (error: any) {
        toast.error('Failed to load credits');
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [isAuthenticated, router, skip, status]);

  const handleApprove = async (creditId: string) => {
    try {
      await creditService.approveCredit(creditId, {});
      toast.success('Credit approved');
      const data = await creditService.getAllCredits(skip, take, status);
      setCredits(data.data);
    } catch (error: any) {
      toast.error('Failed to approve credit');
    }
  };

  const handleReject = async (creditId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await creditService.rejectCredit(creditId, { rejectionReason: reason });
      toast.success('Credit rejected');
      const data = await creditService.getAllCredits(skip, take, status);
      setCredits(data.data);
    } catch (error: any) {
      toast.error('Failed to reject credit');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credit Management</h1>

        <div className="mt-8">
          {/* Status Filter */}
          <div className="mb-6">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setSkip(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="DEFAULTED">Defaulted</option>
            </select>
          </div>

          {/* Credits Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {credits.map((credit) => (
                  <tr key={credit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credit.user.firstName} {credit.user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${typeof credit.amount === 'number' ? credit.amount.toFixed(2) : parseFloat(credit.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credit.tenure} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          credit.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : credit.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {credit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {credit.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(credit.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(credit.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {skip + 1} to {Math.min(skip + take, total)} of {total}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={skip === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={skip + take >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

