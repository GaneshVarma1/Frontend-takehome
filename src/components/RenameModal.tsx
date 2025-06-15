import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTitle: string) => void;
  currentTitle: string;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentTitle,
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onSave(newTitle.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Rename Page</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 rounded transition-colors duration-150"
            tabIndex={0}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <input
                ref={inputRef}
                type="text"
                id="pageTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus:border-orange-500 transition-all duration-150"
                placeholder="Enter page title"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
                ${newTitle.trim() 
                  ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800' 
                  : 'bg-gray-300 cursor-not-allowed opacity-60'
                }
              `}
              tabIndex={0}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 