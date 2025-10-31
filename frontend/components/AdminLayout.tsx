'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

