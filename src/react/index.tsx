import { useState, useEffect, useCallback, useRef } from "react";
import type { Schema, ValidationError } from "../schema/types";
import type { SchemaBuilder } from "../schema/builders";
import { createForm, type FormConfig } from "../form";

/**
 * Form field registration return type
 * Compatible with React Hook Form style
 */
export interface FieldRegistration {
  name: string;
  value: any;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

/**
 * React form hook return type
 */
export interface UseWasmFormReturn<T extends Record<string, any>> {
  // Field registration
  register: (name: keyof T) => FieldRegistration;

  // State
  values: T;
  errors: Record<keyof T, ValidationError | null>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;

  // Methods
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: ValidationError | null) => void;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for WASM-powered form validation
 *
 * Usage:
 * ```tsx
 * const form = useWasmForm({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '' },
 *   onSubmit: async (data) => console.log(data)
 * });
 *
 * <form onSubmit={form.handleSubmit}>
 *   <input {...form.register('email')} />
 *   {form.errors.email && <span>{form.errors.email.message}</span>}
 * </form>
 * ```
 */
export function useWasmForm<T extends Record<string, any>>(
  config: FormConfig<T>,
): UseWasmFormReturn<T> {
  // Create form instance (only once)
  const formRef = useRef(createForm(config));
  const form = formRef.current;

  // Local state for React re-renders
  const [, forceUpdate] = useState({});

  // Subscribe to form changes on mount
  useEffect(() => {
    const unsubscribe = form.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, [form]);

  /**
   * Register a field with the form
   * Returns props to spread on input element
   */
  const register = useCallback(
    (name: keyof T): FieldRegistration => {
      return {
        name: String(name),
        value: form.values[name] ?? "",
        onChange: (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          let value: any;

          if ("type" in event.target && event.target.type === "checkbox") {
            value = (event.target as HTMLInputElement).checked;
          } else if ("type" in event.target && event.target.type === "number") {
            // Convert to number for number inputs
            const numValue = (event.target as HTMLInputElement).valueAsNumber;
            value = isNaN(numValue) ? event.target.value : numValue;
          } else {
            value = event.target.value;
          }

          form.handleChange(name, value);
        },
        onBlur: (
          event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          form.handleBlur(name);
        },
      };
    },
    [form],
  );

  /**
   * Set field value programmatically
   */
  const setValue = useCallback(
    (field: keyof T, value: any) => {
      form.setValue(field, value);
    },
    [form],
  );

  /**
   * Set field error programmatically
   * Useful for async validation or server-side errors
   */
  const setError = useCallback(
    (field: keyof T, error: ValidationError | null) => {
      form.errors[field] = error;
      forceUpdate({});
    },
    [form],
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      await form.handleSubmit(event as any);
    },
    [form],
  );

  /**
   * Reset form to initial state
   */
  const reset = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    register,
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    isSubmitting: form.isSubmitting,
    isValid: form.isValid,
    setValue,
    setError,
    handleSubmit,
    reset,
  };
}

/**
 * Hook to get field error message
 * Returns error message if field is touched and has error
 */
export function useFieldError<T extends Record<string, any>>(
  form: UseWasmFormReturn<T>,
  field: keyof T,
): string | null {
  const error = form.errors[field];
  const touched = form.touched[field];

  if (touched && error) {
    return error.message;
  }

  return null;
}

/**
 * Hook to check if field has error
 */
export function useFieldHasError<T extends Record<string, any>>(
  form: UseWasmFormReturn<T>,
  field: keyof T,
): boolean {
  const error = form.errors[field];
  const touched = form.touched[field];

  return touched && error !== null;
}
