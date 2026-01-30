import { useState, useCallback } from 'react';
import { z, ZodSchema } from 'zod';

export interface ValidationError {
  [key: string]: string;
}

export interface UseFormValidationReturn<T> {
  errors: ValidationError;
  validate: (data: unknown) => data is T;
  validateField: (fieldName: string, value: unknown, schema?: ZodSchema) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  setFieldError: (fieldName: string, message: string) => void;
  hasErrors: boolean;
  getFieldError: (fieldName: string) => string | undefined;
}

/**
 * Custom hook for form validation using Zod schemas
 * 
 * @param schema - Zod schema to validate against
 * @returns Validation utilities
 * 
 * @example
 * ```tsx
 * import { loginSchema } from '@/shared/api/validations';
 * 
 * function LoginForm() {
 *   const { errors, validate, getFieldError, clearFieldError } = useFormValidation(loginSchema);
 *   
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const formData = { uid, password };
 *     
 *     if (validate(formData)) {
 *       // formData is now typed and validated
 *       await login(formData);
 *     }
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input 
 *         value={uid}
 *         onChange={(e) => {
 *           setUid(e.target.value);
 *           clearFieldError('uid');
 *         }}
 *       />
 *       {getFieldError('uid') && <span className="text-red-500">{getFieldError('uid')}</span>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useFormValidation<T>(schema: ZodSchema<T>): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationError>({});

  const validate = useCallback((data: unknown): data is T => {
    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const newErrors: ValidationError = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  }, [schema]);

  const validateField = useCallback((
    fieldName: string, 
    value: unknown, 
    fieldSchema?: ZodSchema
  ): boolean => {
    let result;
    if (fieldSchema) {
      result = fieldSchema.safeParse(value);
    } else {
      // Validate just the field value directly
      result = z.unknown().safeParse(value);
    }
    
    if (result.success) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } else {
      const firstIssue = result.error.issues[0];
      if (firstIssue) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: firstIssue.message,
        }));
      }
      return false;
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return errors[fieldName];
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasErrors,
    getFieldError,
  };
}

/**
 * Utility to format Zod errors into a user-friendly format
 */
export function formatZodErrors(error: z.ZodError): ValidationError {
  const errors: ValidationError = {};
  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return errors;
}

/**
 * Utility to validate data and return typed result or throw
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Utility to safely validate data and return result with errors
 */
export function safeValidate<T>(
  schema: ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}

export default useFormValidation;
