"use client"

import { useEffect } from 'react';

export default function DeleteConfirmation({ isOpen, onConfirm, onCancel }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Delete Activity</h3>
          <p className="mb-6">Are you sure you want to delete this activity? This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}