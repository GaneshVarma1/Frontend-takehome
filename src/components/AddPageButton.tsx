import React from 'react';
import { Plus } from 'lucide-react';

interface AddPageButtonProps {
  onAdd: () => void;
  onHover: () => void;
  onLeave: () => void;
  variant?: 'icon' | 'text';
}

export const AddPageButton: React.FC<AddPageButtonProps> = ({
  onAdd,
  onHover,
  onLeave,
  variant = 'icon'
}) => {
  if (variant === 'text') {
    return (
      <button
        onClick={onAdd}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="flex items-center justify-center font-medium bg-white text-black border border-gray-200 shadow-sm hover:bg-gray-50 transition whitespace-nowrap"
        style={{
          width: '106.5px',
          height: '32px',
          borderRadius: '8px',
          borderWidth: '0.5px',
          padding: '4px 10px',
          gap: '6px',
        }}
        title="Add page"
        tabIndex={0}
      >
        + Add page
      </button>
    );
  }

  return (
    <div
      className="relative w-8 h-8 flex items-center justify-center"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <button
        onClick={onAdd}
        className="relative w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: '#FFFFFF',
          border: '0.5px solid #E1E1E1',
          boxShadow: '0px 1px 3px 0px #0000000A, 0px 1px 1px 0px #00000005'
        }}
        title="Add page"
        tabIndex={0}
      >
        <Plus className="w-4 h-4 text-black" />
      </button>
    </div>
  );
};