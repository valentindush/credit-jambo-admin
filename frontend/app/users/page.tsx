'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usersService } from '@/lib/api/users.service';
import { useAuthStore } from '@/lib/store/auth.store';
import AdminLayout from '@/components/AdminLayout';
import { Search } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const take = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await usersService.getAllUsers(skip, take, search);
        setUsers(data.data);
        setTotal(data.total);
      } catch (error: any) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, router, skip, search]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await usersService.updateUserStatus(userId, newStatus);
      toast.success('User status updated');
      // Refresh users list
      const data = await usersService.getAllUsers(skip, take, search);
      setUsers(data.data);
    } catch (error: any) {
      toast.error('Failed to update user status');
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
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>

        <div className="mt-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSkip(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 text-black"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.emailVerified ? (
                        <span className="text-green-600">✓ Verified</span>
                      ) : (
                        <span className="text-red-600">✗ Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
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
                className="px-4 py-2 border text-gray-800 border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={skip + take >= total}
                className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
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

