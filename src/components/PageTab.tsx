import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Info, FileText, File, CheckCircle, MoreHorizontal } from 'lucide-react';
import { FormPage } from '../types';

interface PageTabProps {
  page: FormPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

const iconMap = {
  'info': Info,
  'file-text': FileText,
  'file': File,
  'check-circle': CheckCircle,
};

export const PageTab: React.FC<PageTabProps> = ({
  page,
  index,
  isActive,
  onClick,
  onContextMenu,
}) => {
  const IconComponent = iconMap[page.icon as keyof typeof iconMap] || File;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Draggable draggableId={page.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative flex items-center justify-center text-sm font-medium
            transition-all duration-200 cursor-move select-none min-w-0
            focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
            ${isActive 
              ? 'bg-orange-50 text-black border border-orange-200 shadow-sm' 
              : ''
            }
            ${snapshot.isDragging 
              ? 'shadow-xl ring-2 ring-orange-200 bg-white z-50 rotate-2 scale-105 border-orange-300' 
              : ''
            }
          `}
          onClick={onClick}
          onContextMenu={onContextMenu}
          tabIndex={0}
          onMouseEnter={() => !isActive && setIsHovered(true)}
          onMouseLeave={() => !isActive && setIsHovered(false)}
          style={{
            ...provided.draggableProps.style,
            ...(isActive
              ? { width: '108px', height: '32px', borderRadius: '8px', borderWidth: '0.5px', padding: '4px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
              : { backgroundColor: isHovered ? 'rgba(157, 164, 178, 0.35)' : 'rgba(157, 164, 178, 0.15)', color: '#677289', width: '83px', height: '32px', borderRadius: '8px', borderWidth: '0.5px', padding: '4px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
            )
          }}
        >
          {/* Page Icon */}
          <div
            className="flex-shrink-0 transition-colors duration-200 flex items-center justify-center"
            style={!isActive ? { color: '#677289' } : { color: '#EA580C' }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          {/* Page Title */}
          <span className="whitespace-nowrap font-medium">
            {page.title}
          </span>
          {/* More Options */}
          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e);
              }}
              className="transition-opacity duration-200 p-1 rounded hover:bg-orange-100 -mr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 opacity-100 text-orange-600"
              tabIndex={0}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};