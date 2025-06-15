import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Info, FileText, File, CheckCircle, MoreVertical } from 'lucide-react';
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
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
            ${isActive ? 'bg-white text-black border border-gray-200 shadow-lg' : ''}
            ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-200 bg-white z-50 rotate-2 scale-105' : ''}
          `}
          tabIndex={0}
          onClick={onClick}
          onContextMenu={onContextMenu}
          onMouseEnter={() => !isActive && setIsHovered(true)}
          onMouseLeave={() => !isActive && setIsHovered(false)}
          style={{
            ...provided.draggableProps.style,
            ...(isActive
              ? { minWidth: '108px', height: '32px', borderRadius: '8px', borderWidth: '0.5px', padding: '4px 8px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
              : { backgroundColor: isHovered ? 'rgba(157, 164, 178, 0.35)' : 'rgba(157, 164, 178, 0.15)', color: '#677289', minWidth: '83px', height: '32px', borderRadius: '8px', borderWidth: '0.5px', padding: '4px 8px', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
            ),
            ...(snapshot.isDragging ? { border: '0.5px solid #2F72E2' } : {})
          }}
        >
          {/* Page Icon */}
          <div
            className="flex-shrink-0 transition-colors duration-200 flex items-center justify-center"
            style={!isActive ? { color: '#677289' } : { color: '#F59D0E' }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          {/* Page Title */}
          <span className="whitespace-nowrap font-medium truncate max-w-[120px]">
            {page.title}
          </span>
          {/* More Options */}
          {isActive && !snapshot.isDragging && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e);
              }}
              className="transition-opacity duration-200 p-1 rounded -mr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              style={{ color: '#F59D0E', backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF7E6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              tabIndex={0}
            >
              <MoreVertical className="w-3 h-3" style={{ color: '#9DA4B2' }} />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};