import React, { useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Toaster, toast } from 'react-hot-toast';

import { PageNavigationBar } from './components/PageNavigationBar';
import { PageRenderer } from './components/PageRenderer';
import { usePages } from './hooks/usePages';
import { useForm } from './hooks/useForm';
import { findPageById } from './utils/helpers';
import { 
  CSS_CLASSES, 
  SUCCESS_MESSAGES, 
  TOAST_CONFIG, 
  TOAST_ICONS 
} from './utils/constants';


const App: React.FC = () => {
  const {
    pages,
    activePageId,
    reorderPages,
    setActivePage,
    addPage,
    updatePage,
    deletePage,
    duplicatePage,
    movePageToFirst,
    renamePage,
  } = usePages();

  const {
    formData,
    updateField,
    getFieldError,
    validateForm,
  } = useForm();

  // Drag and drop handler with proper error handling
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;
    
    reorderPages(source.index, destination.index);
  }, [reorderPages]);

  // Action handlers with proper error handling
  const handlePreview = useCallback(() => {
    const validation = validateForm(pages);
    
    if (!validation.isValid) {
      toast.error('Please fix form errors before previewing', {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.WARNING,
      });
      return;
    }

    toast.success(SUCCESS_MESSAGES.PREVIEW_ACTIVATED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.PREVIEW,
    });
  }, [validateForm, pages]);

  const handlePublish = useCallback(() => {
    const validation = validateForm(pages);
    
    if (!validation.isValid) {
      toast.error('Please fix form errors before publishing', {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.WARNING,
      });
      return;
    }

    // In a real app, this would make an API call
    toast.success(SUCCESS_MESSAGES.FORM_PUBLISHED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.PUBLISH,
    });
  }, [validateForm, pages]);

  // Get current page with type safety
  const activePage = findPageById(pages, activePageId);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: TOAST_CONFIG.duration,
            style: TOAST_CONFIG.style,
          }}
        />
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Form Builder
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage your form pages
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePreview}
                  className={CSS_CLASSES.BUTTON_SECONDARY}
                  type="button"
                  aria-label="Preview form"
                >
                  Preview
                </button>
                <button 
                  onClick={handlePublish}
                  className={CSS_CLASSES.BUTTON_PRIMARY}
                  type="button"
                  aria-label="Publish form"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Navigation */}
        <PageNavigationBar 
          pages={[...pages]} 
          activePageId={activePageId}
          onPageChange={setActivePage}
          onAddPage={addPage}
          _onUpdatePage={updatePage}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
          onMovePageToFirst={movePageToFirst}
          onRenamePage={renamePage}
        />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className={`${CSS_CLASSES.CARD} p-8`}>
            {activePage ? (
              <PageRenderer
                page={activePage}
                formData={formData}
                onFieldChange={updateField}
                getFieldError={getFieldError}
              />
            ) : (
              <div className="text-center text-red-600">
                <p>Error: Page not found</p>
                <button 
                  onClick={() => setActivePage(pages[0]?.id)}
                  className={CSS_CLASSES.BUTTON_PRIMARY}
                  type="button"
                >
                  Go to first page
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </DragDropContext>
  );
};

export default App;