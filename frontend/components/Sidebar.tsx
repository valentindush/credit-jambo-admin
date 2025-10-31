'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import LogoutConfirmDialog from './LogoutConfirmDialog';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      label: 'Credits',
      href: '/credits',
      icon: CreditCard,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">CreditJambo</h1>
          <p className="text-sm text-blue-200">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-400 hover:bg-red-500 cursor-pointer transition-colors text-white font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}

