'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              CreditJambo Admin
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link href="/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link href="/credits" className="text-gray-600 hover:text-gray-900">
              Credits
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/users"
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Users
            </Link>
            <Link
              href="/credits"
              className="block text-gray-600 hover:text-gray-900 py-2"
            >
              Credits
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 hover:text-red-900 py-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

