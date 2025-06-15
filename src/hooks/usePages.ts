import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { FormPage, UsePagesReturn, PageChangeHandler, PageUpdateHandler } from '../types';
import { 
  DEFAULT_PAGES, 
  APP_CONFIG, 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES, 
  TOAST_CONFIG,
  TOAST_ICONS 
} from '../utils/constants';
import {
  createNewPage,
  duplicatePage,
  reorderPages as reorderPagesHelper,
  updatePageInArray,
  removePageFromArray,
  sortPagesByOrder,
  findPageById,
} from '../utils/helpers';

export const usePages = (initialPages: readonly FormPage[] = DEFAULT_PAGES): UsePagesReturn => {
  const [pages, setPages] = useState<FormPage[]>(() => sortPagesByOrder(initialPages));
  const [activePageId, setActivePageId] = useState<string>(pages[0]?.id || '');

  const sortedPages = useMemo(() => sortPagesByOrder(pages), [pages]);

  const addPage = useCallback((afterIndex: number) => {
    if (pages.length >= APP_CONFIG.MAX_PAGES) {
      toast.error(`Maximum ${APP_CONFIG.MAX_PAGES} pages allowed`, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.WARNING,
      });
      return;
    }

    const newPage = createNewPage(afterIndex, pages);
    
    setPages(prevPages => {
      const sorted = sortPagesByOrder(prevPages);
      const newPages = [...sorted];
      newPages.splice(afterIndex + 1, 0, newPage);
      
      return newPages.map((page, index) => ({
        ...page,
        order: index,
      }));
    });

    setActivePageId(newPage.id);

    toast.success(SUCCESS_MESSAGES.PAGE_ADDED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.PAGE,
    });
  }, [pages]);

  const updatePage: PageUpdateHandler = useCallback((pageId, updates) => {
    const existingPage = findPageById(pages, pageId);
    if (!existingPage) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.ERROR,
      });
      return;
    }

    setPages(prevPages => updatePageInArray(prevPages, pageId, updates));
  }, [pages]);

  const deletePage = useCallback((pageId: string) => {
    if (pages.length <= APP_CONFIG.MIN_PAGES) {
      toast.error(ERROR_MESSAGES.CANNOT_DELETE_LAST_PAGE, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.WARNING,
      });
      return;
    }

    const pageToDelete = findPageById(pages, pageId);
    if (!pageToDelete) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.ERROR,
      });
      return;
    }

    // If deleting the active page, switch to the first remaining page
    if (activePageId === pageId) {
      const remainingPages = pages.filter(p => p.id !== pageId);
      const sortedRemaining = sortPagesByOrder(remainingPages);
      if (sortedRemaining.length > 0) {
        setActivePageId(sortedRemaining[0].id);
      }
    }

    setPages(prevPages => removePageFromArray(prevPages, pageId));

    toast.success(SUCCESS_MESSAGES.PAGE_DELETED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.DELETE,
    });
  }, [pages, activePageId]);

  const reorderPages = useCallback((sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;

    setPages(prevPages => {
      const reordered = reorderPagesHelper(prevPages, sourceIndex, destinationIndex);
      return reordered;
    });
  }, []);

  const setActivePage: PageChangeHandler = useCallback((pageId) => {
    const page = findPageById(pages, pageId);
    if (!page) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.ERROR,
      });
      return;
    }

    setActivePageId(pageId);
  }, [pages]);

  const duplicatePageHandler = useCallback((pageId: string) => {
    const pageToDuplicate = findPageById(pages, pageId);
    if (!pageToDuplicate) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.ERROR,
      });
      return;
    }

    if (pages.length >= APP_CONFIG.MAX_PAGES) {
      toast.error(`Maximum ${APP_CONFIG.MAX_PAGES} pages allowed`, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.WARNING,
      });
      return;
    }

    const newPage = duplicatePage(pageToDuplicate);

    setPages(prevPages => {
      const allPages = [...prevPages, newPage];
      const sorted = sortPagesByOrder(allPages);
      
      return sorted.map((page, index) => ({
        ...page,
        order: index,
      }));
    });

    setActivePageId(newPage.id);

    toast.success(SUCCESS_MESSAGES.PAGE_DUPLICATED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.COPY,
    });
  }, [pages]);

  const movePageToFirst = useCallback((pageId: string) => {
    const pageToMove = findPageById(pages, pageId);
    if (!pageToMove) {
      toast.error(ERROR_MESSAGES.PAGE_NOT_FOUND, {
        ...TOAST_CONFIG,
        icon: TOAST_ICONS.ERROR,
      });
      return;
    }

    setPages(prevPages => {
      const otherPages = prevPages.filter(p => p.id !== pageId);
      const sortedOthers = sortPagesByOrder(otherPages);
      const newPages = [pageToMove, ...sortedOthers];
      
      return newPages.map((page, index) => ({
        ...page,
        order: index,
        updatedAt: new Date(),
      }));
    });

    toast.success(SUCCESS_MESSAGES.PAGE_MOVED_TO_FIRST, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.MOVE,
    });
  }, [pages]);

  const renamePage = useCallback((pageId: string, newTitle: string) => {
    updatePage(pageId, { title: newTitle.trim() });
    
    toast.success(SUCCESS_MESSAGES.PAGE_RENAMED, {
      ...TOAST_CONFIG,
      icon: TOAST_ICONS.EDIT,
    });
  }, [updatePage]);

  return {
    pages: sortedPages,
    activePageId,
    addPage,
    updatePage,
    deletePage,
    reorderPages,
    setActivePage,
    duplicatePage: duplicatePageHandler,
    movePageToFirst,
    renamePage,
  };
}; 