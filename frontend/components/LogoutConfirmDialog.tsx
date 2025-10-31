'use client';

import { AlertCircle } from 'lucide-react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LogoutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600">
              Are you sure you want to logout? You will need to login again to access the admin dashboard.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

