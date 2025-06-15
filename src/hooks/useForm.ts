import { useState, useCallback, useMemo } from 'react';
import { FormData, FormError, UseFormReturn, FormDataChangeHandler, ValidationResult, FormPage } from '../types';
import { validateFormData } from '../utils/helpers';

export const useForm = (initialData: FormData = {}): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormError[]>([]);

  const updateField: FormDataChangeHandler = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific errors when user starts typing
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const validateForm = useCallback((pages: readonly FormPage[]): ValidationResult => {
    const result = validateFormData(formData, pages);
    setErrors([...result.errors]);
    return result;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors([]);
  }, []);

  const isValid = useMemo(() => errors.length === 0, [errors]);

  const getFieldError = useCallback((fieldId: string): string | undefined => {
    const fieldError = errors.find(error => error.field === fieldId);
    return fieldError?.message;
  }, [errors]);

  const hasFieldError = useCallback((fieldId: string): boolean => {
    return errors.some(error => error.field === fieldId);
  }, [errors]);

  const clearFieldError = useCallback((fieldId: string) => {
    setErrors(prev => prev.filter(error => error.field !== fieldId));
  }, []);

  const setFieldError = useCallback((fieldId: string, message: string) => {
    setErrors(prev => [
      ...prev.filter(error => error.field !== fieldId),
      { field: fieldId, message },
    ]);
  }, []);

  return {
    formData,
    errors,
    isValid,
    updateField,
    validateForm,
    resetForm,
    // Additional helper methods
    getFieldError,
    hasFieldError,
    clearFieldError,
    setFieldError,
  };
}; 