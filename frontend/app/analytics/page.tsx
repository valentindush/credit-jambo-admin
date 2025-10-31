'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { analyticsService } from '@/lib/api/analytics.service';
import { useAuthStore } from '@/lib/store/auth.store';
import AdminLayout from '@/components/AdminLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const [dashboard, transactions, userGrowth, creditPerformance, savings] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getTransactionStats(days),
          analyticsService.getUserGrowth(days),
          analyticsService.getCreditPerformance(),
          analyticsService.getSavingsStats(),
        ]);

        setData({
          dashboard,
          transactions,
          userGrowth,
          creditPerformance,
          savings,
        });
      } catch (error: any) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, router, days]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-600">Total Users</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {data?.dashboard?.totalUsers || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
            <h3 className="text-sm font-medium text-green-600">Active Users</h3>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {data?.dashboard?.activeUsers || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
            <h3 className="text-sm font-medium text-purple-600">Total Credits</h3>
            <p className="text-3xl font-bold text-purple-900 mt-2">
              {data?.dashboard?.totalCredits || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border border-orange-200">
            <h3 className="text-sm font-medium text-orange-600">Pending Credits</h3>
            <p className="text-3xl font-bold text-orange-900 mt-2">
              {data?.dashboard?.pendingCredits || 0}
            </p>
          </div>
        </div>

        {/* Transaction Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Transaction Volume</h2>
          {data?.transactions?.daily && data.transactions.daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.transactions.daily}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No transaction data available</p>
          )}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{data?.transactions?.totalTransactions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${typeof data?.transactions?.totalAmount === 'number'
                  ? data.transactions.totalAmount.toFixed(2)
                  : parseFloat(data?.transactions?.totalAmount || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${typeof data?.transactions?.averageAmount === 'number'
                  ? data.transactions.averageAmount.toFixed(2)
                  : parseFloat(data?.transactions?.averageAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Savings Statistics */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-3xl font-bold text-green-600">{data?.savings?.totalAccounts || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ${typeof data?.savings?.totalBalance === 'number'
                  ? data.savings.totalBalance.toFixed(2)
                  : parseFloat(data?.savings?.totalBalance || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ${typeof data?.savings?.averageBalance === 'number'
                  ? data.savings.averageBalance.toFixed(2)
                  : parseFloat(data?.savings?.averageBalance || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Status Distribution</h2>
            {data?.creditPerformance ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: data.creditPerformance.totalApproved },
                      { name: 'Rejected', value: data.creditPerformance.totalRejected },
                      { name: 'Disbursed', value: data.creditPerformance.totalDisbursed },
                      { name: 'Defaulted', value: data.creditPerformance.totalDefaulted },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No credit data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approval Rate</span>
                <span className="text-2xl font-bold text-green-600">{data?.creditPerformance?.approvalRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejection Rate</span>
                <span className="text-2xl font-bold text-red-600">{data?.creditPerformance?.rejectionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Default Rate</span>
                <span className="text-2xl font-bold text-orange-600">{data?.creditPerformance?.defaultRate || 0}%</span>
              </div>
              <hr className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Requested</p>
                  <p className="text-xl font-bold">{data?.creditPerformance?.totalRequested || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Approved</p>
                  <p className="text-xl font-bold text-green-600">{data?.creditPerformance?.totalApproved || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h2>
          {data?.userGrowth && data.userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.userGrowth.map((item: any) => ({
                  date: new Date(item.createdAt).toLocaleDateString(),
                  count: item._count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  name="New Users"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No user growth data available</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

