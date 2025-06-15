// Core domain types with better type safety
export type PageContentType = 'intro' | 'details' | 'mood' | 'ending';

export type FormFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select';

export interface FormField {
  readonly id: string;
  readonly label: string;
  readonly type: FormFieldType;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly options?: readonly string[];
  readonly validation?: {
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly pattern?: string;
  };
}

// Discriminated union for page content - ensures type safety
export type PageContent = 
  | {
      readonly type: 'intro';
      readonly title: string;
      readonly description: string;
    }
  | {
      readonly type: 'details';
      readonly fields: readonly FormField[];
    }
  | {
      readonly type: 'mood';
      readonly question: string;
      readonly options: readonly string[];
    }
  | {
      readonly type: 'ending';
      readonly message: string;
      readonly showName?: boolean;
      readonly showMood?: boolean;
    };

export interface FormPage {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly icon: string;
  readonly content: PageContent;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// UI-specific types
export interface ContextMenuPosition {
  readonly x: number;
  readonly y: number;
}

export type ContextMenuVariant = 'default' | 'danger';

export interface ContextMenuAction {
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly onClick: () => void;
  readonly variant?: ContextMenuVariant;
  readonly disabled?: boolean;
}

// Form data types
export type FormData = Record<string, string | string[]>;

// Error types
export interface FormError {
  readonly field: string;
  readonly message: string;
}

export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

// Event handler types
export type PageChangeHandler = (pageId: string) => void;
export type FormDataChangeHandler = (field: string, value: string | string[]) => void;
export type PageUpdateHandler = (pageId: string, updates: Partial<FormPage>) => void;

// Constants
export const ICONS = {
  INFO: 'info',
  FILE_TEXT: 'file-text',
  FILE: 'file',
  CHECK_CIRCLE: 'check-circle',
} as const;

export type IconType = typeof ICONS[keyof typeof ICONS];

// Validation schemas
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly FormError[];
}

// Hook return types
export interface UseFormReturn {
  readonly formData: FormData;
  readonly errors: readonly FormError[];
  readonly isValid: boolean;
  readonly updateField: FormDataChangeHandler;
  readonly validateForm: (pages: readonly FormPage[]) => ValidationResult;
  readonly resetForm: () => void;
  readonly getFieldError: (fieldId: string) => string | undefined;
  readonly hasFieldError: (fieldId: string) => boolean;
  readonly clearFieldError: (fieldId: string) => void;
  readonly setFieldError: (fieldId: string, message: string) => void;
}

export interface UsePagesReturn {
  readonly pages: readonly FormPage[];
  readonly activePageId: string;
  readonly addPage: (afterIndex: number) => void;
  readonly updatePage: PageUpdateHandler;
  readonly deletePage: (pageId: string) => void;
  readonly reorderPages: (sourceIndex: number, destinationIndex: number) => void;
  readonly setActivePage: PageChangeHandler;
  readonly duplicatePage: (pageId: string) => void;
  readonly movePageToFirst: (pageId: string) => void;
  readonly renamePage: (pageId: string, newTitle: string) => void;
}