import { FormPage, FormField, FormData, ValidationResult, FormError } from '../types';
import { ERROR_MESSAGES } from './constants';

/**
 * Generates a unique ID for pages and form fields
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safely sorts pages by their order property
 */
export const sortPagesByOrder = (pages: readonly FormPage[]): FormPage[] => {
  return [...pages].sort((a, b) => a.order - b.order);
};

/**
 * Reorders pages after drag and drop operation
 */
export const reorderPages = (
  pages: readonly FormPage[],
  sourceIndex: number,
  destinationIndex: number
): FormPage[] => {
  const sortedPages = sortPagesByOrder(pages);
  const [removed] = sortedPages.splice(sourceIndex, 1);
  sortedPages.splice(destinationIndex, 0, removed);
  
  return sortedPages.map((page, index) => ({
    ...page,
    order: index,
    updatedAt: new Date(),
  }));
};

/**
 * Creates a new page with default content
 */
export const createNewPage = (
  afterIndex: number,
  existingPages: readonly FormPage[],
  title?: string
): FormPage => {
  return {
    id: generateId(),
    title: title || `Page ${existingPages.length + 1}`,
    order: afterIndex + 1,
    icon: 'file',
    content: {
      type: 'intro',
      title: 'New Page',
      description: 'Add your content here',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Duplicates a page with a new ID and updated title
 */
export const duplicatePage = (page: FormPage): FormPage => {
  return {
    ...page,
    id: generateId(),
    title: `${page.title} Copy`,
    order: page.order + 0.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Validates a form field value
 */
export const validateField = (field: FormField, value: string): FormError[] => {
  const errors: FormError[] = [];

  // Required field validation
  if (field.required && !value.trim()) {
    errors.push({
      field: field.id,
      message: ERROR_MESSAGES.REQUIRED_FIELD,
    });
    return errors; // Return early if required field is empty
  }

  // Skip other validations if field is empty and not required
  if (!value.trim()) {
    return errors;
  }

  // Length validations
  if (field.validation?.minLength && value.length < field.validation.minLength) {
    errors.push({
      field: field.id,
      message: ERROR_MESSAGES.MIN_LENGTH(field.validation.minLength),
    });
  }

  if (field.validation?.maxLength && value.length > field.validation.maxLength) {
    errors.push({
      field: field.id,
      message: ERROR_MESSAGES.MAX_LENGTH(field.validation.maxLength),
    });
  }

  // Email validation
  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push({
        field: field.id,
        message: ERROR_MESSAGES.INVALID_EMAIL,
      });
    }
  }

  // Pattern validation
  if (field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern);
    if (!regex.test(value)) {
      errors.push({
        field: field.id,
        message: 'Invalid format',
      });
    }
  }

  return errors;
};

/**
 * Validates all form data against page fields
 */
export const validateFormData = (
  formData: FormData,
  pages: readonly FormPage[]
): ValidationResult => {
  const allErrors: FormError[] = [];

  pages.forEach((page) => {
    if (page.content.type === 'details') {
      page.content.fields.forEach((field) => {
        const value = formData[field.id] as string || '';
        const fieldErrors = validateField(field, value);
        allErrors.push(...fieldErrors);
      });
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Finds a page by ID with type safety
 */
export const findPageById = (
  pages: readonly FormPage[],
  pageId: string
): FormPage | undefined => {
  return pages.find((page) => page.id === pageId);
};

/**
 * Gets the next available page ID for navigation
 */
export const getNextPageId = (
  pages: readonly FormPage[],
  currentPageId: string,
  direction: 'next' | 'prev'
): string | null => {
  const sortedPages = sortPagesByOrder(pages);
  const currentIndex = sortedPages.findIndex((page) => page.id === currentPageId);
  
  if (currentIndex === -1) return null;
  
  const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  
  if (nextIndex < 0 || nextIndex >= sortedPages.length) return null;
  
  return sortedPages[nextIndex].id;
};

/**
 * Safely updates a page in the pages array
 */
export const updatePageInArray = (
  pages: readonly FormPage[],
  pageId: string,
  updates: Partial<FormPage>
): FormPage[] => {
  return pages.map((page) =>
    page.id === pageId
      ? { ...page, ...updates, updatedAt: new Date() }
      : page
  );
};

/**
 * Removes a page from the array and reorders remaining pages
 */
export const removePageFromArray = (
  pages: readonly FormPage[],
  pageId: string
): FormPage[] => {
  const filteredPages = pages.filter((page) => page.id !== pageId);
  const sortedPages = sortPagesByOrder(filteredPages);
  
  return sortedPages.map((page, index) => ({
    ...page,
    order: index,
    updatedAt: new Date(),
  }));
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Deep clone utility for immutable updates
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

/**
 * Type guard to check if a value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}; 