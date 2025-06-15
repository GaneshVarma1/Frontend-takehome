import { FormPage, ICONS } from '../types';

// Application constants
export const APP_CONFIG = {
  MIN_PAGES: 1,
  MAX_PAGES: 20,
  DEFAULT_PAGE_TITLE: 'New Page',
  TOAST_DURATION: 3000,
} as const;

// Default page templates
export const DEFAULT_PAGES: readonly FormPage[] = [
  {
    id: '1',
    title: 'Intro',
    order: 0,
    icon: ICONS.INFO,
    content: {
      type: 'intro',
      title: 'Welcome to Sri Assessment',
      description: 'I will be waiting for your feedback -SRI',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Details',
    order: 1,
    icon: ICONS.FILE_TEXT,
    content: {
      type: 'details',
      fields: [
        {
          id: 'name',
          label: 'Your Name',
          type: 'text',
          placeholder: 'Enter your name',
          required: false,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Other',
    order: 2,
    icon: ICONS.FILE,
    content: {
      type: 'mood',
      question: 'How is your mood today?',
      options: ['😊', '😐', '😢', '😡', '🤔'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Ending',
    order: 3,
    icon: ICONS.CHECK_CIRCLE,
    content: {
      type: 'ending',
      message: 'Thanks for filling out the form!',
      showName: true,
      showMood: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as const;

// Toast configuration
export const TOAST_CONFIG = {
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
  },
  duration: APP_CONFIG.TOAST_DURATION,
} as const;

// CSS classes for consistent styling
export const CSS_CLASSES = {
  BUTTON_PRIMARY: 'px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm',
  BUTTON_SECONDARY: 'px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium',
  INPUT_BASE: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500',
  CARD: 'bg-white rounded-xl shadow-sm border border-gray-200',
  FOCUS_RING: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  CANNOT_DELETE_LAST_PAGE: 'Cannot delete the last page!',
  PAGE_NOT_FOUND: 'Page not found',
  GENERIC_ERROR: 'An unexpected error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PAGE_ADDED: 'New page added!',
  PAGE_RENAMED: 'Page renamed!',
  PAGE_DUPLICATED: 'Page duplicated!',
  PAGE_DELETED: 'Page deleted!',
  PAGE_MOVED_TO_FIRST: 'Page moved to first position!',
  FORM_PUBLISHED: 'Form published successfully!',
  PREVIEW_ACTIVATED: 'Preview mode activated!',
} as const;

// Icons for toast messages
export const TOAST_ICONS = {
  SUCCESS: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  PAGE: '📄',
  EDIT: '✏️',
  COPY: '📋',
  DELETE: '🗑️',
  MOVE: '⬆️',
  PUBLISH: '🚀',
  PREVIEW: '👁️',
} as const; 