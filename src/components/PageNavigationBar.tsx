import React, { useState, useCallback } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { FormPage } from '../types';
import { PageTab } from './PageTab';
import { AddPageButton } from './AddPageButton';
import { ContextMenu } from './ContextMenu';
import { RenameModal } from './RenameModal';

interface PageNavigationBarProps {
  className?: string;
  pages: FormPage[];
  activePageId: string;
  onPageChange: (pageId: string) => void;
  onAddPage: (afterIndex: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdatePage?: (pageId: string, updates: Partial<FormPage>) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onMovePageToFirst: (pageId: string) => void;
  onRenamePage: (pageId: string, newTitle: string) => void;
}

export const PageNavigationBar: React.FC<PageNavigationBarProps> = ({ 
  className = '',
  pages,
  activePageId,
  onPageChange,
  onAddPage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePageToFirst,
  onRenamePage
}) => {
  const [contextMenu, setContextMenu] = useState<{
    pageId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    pageId: string;
    currentTitle: string;
  } | null>(null);

  const handleAddPage = useCallback((afterIndex: number) => {
    onAddPage(afterIndex);
  }, [onAddPage]);

  const handleContextMenu = useCallback((pageId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      pageId,
      position: { x: event.clientX, y: event.clientY }
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleRenamePage = useCallback((pageId: string) => {
    const currentPage = pages.find(p => p.id === pageId);
    if (currentPage) {
      setRenameModal({
        isOpen: true,
        pageId,
        currentTitle: currentPage.title
      });
    }
    setContextMenu(null);
  }, [pages]);

  const handleSaveRename = useCallback((newTitle: string) => {
    if (renameModal) {
      onRenamePage(renameModal.pageId, newTitle);
    }
  }, [renameModal, onRenamePage]);

  const handleCloseRenameModal = useCallback(() => {
    setRenameModal(null);
  }, []);

  const handleDuplicatePage = useCallback((pageId: string) => {
    onDuplicatePage(pageId);
    setContextMenu(null);
  }, [onDuplicatePage]);

  const handleDeletePage = useCallback((pageId: string) => {
    onDeletePage(pageId);
    setContextMenu(null);
  }, [onDeletePage]);

  const handleSetFirstPage = useCallback((pageId: string) => {
    onMovePageToFirst(pageId);
    setContextMenu(null);
  }, [onMovePageToFirst]);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
        <div className="flex items-center w-full overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
          <Droppable droppableId="pages" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-center"
              >
                {pages.map((page, index) => (
                  <React.Fragment key={page.id}>
                    {/* Dotted line between tabs */}
                    {index > 0 && (
                      <div 
                        className="w-5 h-px"
                        style={{
                          borderTop: '1px dotted #D1D5DB',
                          margin: '0 0',
                          zIndex: 0
                        }}
                      />
                    )}
                    
                    <PageTab
                      page={page}
                      index={index}
                      isActive={activePageId === page.id}
                      onClick={() => onPageChange(page.id)}
                      onContextMenu={(event) => handleContextMenu(page.id, event)}
                    />
                    
                    {/* Add page button after active tab */}
                    {activePageId === page.id && (
                      <>
                        <div 
                          className="w-5 h-px"
                          style={{
                            borderTop: '1px dotted #D1D5DB',
                            margin: '0 0',
                            zIndex: 0
                          }}
                        />
                        <div className="relative">
                          <AddPageButton
                            onAdd={() => handleAddPage(index)}
                            onHover={() => {}}
                            onLeave={() => {}}
                          />
                        </div>
                      </>
                    )}
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add page button at the end */}
          <div className="ml-2">
            <AddPageButton
              onAdd={() => handleAddPage(pages.length - 1)}
              onHover={() => {}}
              onLeave={() => {}}
              variant="text"
            />
          </div>
        </div>

        {contextMenu && (
          <ContextMenu
            pageId={contextMenu.pageId}
            position={contextMenu.position}
            onClose={handleCloseContextMenu}
            onRename={handleRenamePage}
            onDuplicate={handleDuplicatePage}
            onDelete={handleDeletePage}
            onSetFirstPage={handleSetFirstPage}
            canDelete={pages.length > 1}
          />
        )}
        {renameModal && (
          <RenameModal
            isOpen={renameModal.isOpen}
            onClose={handleCloseRenameModal}
            onSave={handleSaveRename}
            currentTitle={renameModal.currentTitle}
          />
        )}
      </div>
    </div>
  );
};