import React, { useEffect, useRef } from 'react';
import { Flag, Edit3, Copy, Clipboard, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  pageId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onRename: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
  onDelete: (pageId: string) => void;
  onSetFirstPage: (pageId: string) => void;
  canDelete: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  pageId,
  position,
  onClose,
  onRename,
  onDuplicate,
  onDelete,
  onSetFirstPage,
  canDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuActions = [
    {
      label: 'Set as first page',
      icon: Flag,
      onClick: () => onSetFirstPage(pageId),
      variant: 'default' as const,
    },
    {
      label: 'Rename',
      icon: Edit3,
      onClick: () => onRename(pageId),
      variant: 'default' as const,
    },
    {
      label: 'Copy',
      icon: Clipboard,
      onClick: () => onDuplicate(pageId),
      variant: 'default' as const,
    },
    {
      label: 'Duplicate',
      icon: Copy,
      onClick: () => onDuplicate(pageId),
      variant: 'default' as const,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: () => onDelete(pageId),
      variant: 'danger' as const,
      disabled: !canDelete,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48 animate-in fade-in zoom-in-95 duration-200"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-8px, 8px)',
        }}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
        </div>
        
        {/* Divider above menu items */}
        <div className="border-t border-gray-300 my-1" />
        {/* First four menu items */}
        {menuActions.slice(0, 4).map((action, idx) => (
          <React.Fragment key={action.label}>
            <button
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
                ${action.variant === 'danger' 
                  ? 'text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:bg-red-50 disabled:text-red-300' 
                  : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus-visible:bg-gray-50'
                }
                ${action.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
              tabIndex={action.disabled ? -1 : 0}
              aria-disabled={action.disabled}
            >
              {/* Flag icon blue, others default */}
              {action.label === 'Set as first page' ? (
                <Flag className="w-4 h-4 flex-shrink-0" color="#2563eb" />
              ) : (
                <action.icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{action.label}</span>
            </button>
            {/* Divider after Duplicate (idx === 3) */}
            {idx === 3 && <div className="w-full border-b-2 border-black my-3" />}
          </React.Fragment>
        ))}
        {/* Light gray divider above Delete section */}
        <div className="px-3 my-4">
          <hr className="border-t-2 border-gray-300" />
        </div>
        {/* Delete menu item in its own section */}
        <div className="px-2 pt-4 pb-2">
          {menuActions.slice(4).map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
                text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:bg-red-50 disabled:text-red-300
                ${action.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
              tabIndex={action.disabled ? -1 : 0}
              aria-disabled={action.disabled}
            >
              <action.icon className="w-4 h-4 flex-shrink-0" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};