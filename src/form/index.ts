import type { Schema, ValidationError } from "../schema/types";
import type { SchemaBuilder } from "../schema/builders";
import { Validator } from "../validator";

/**
 * Form field state
 */
export interface FieldState {
  value: any;
  touched: boolean;
  error: ValidationError | null;
}

/**
 * Form state
 */
export interface FormState<T extends Record<string, any>> {
  values: T;
  touched: Record<keyof T, boolean>;
  errors: Record<keyof T, ValidationError | null>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Form configuration
 */
export interface FormConfig<T extends Record<string, any>> {
  schema: SchemaBuilder<T> | Schema;
  defaultValues: T;
  onSubmit: (data: T) => void | Promise<void>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

/**
 * Form instance API
 */
export interface Form<T extends Record<string, any>> {
  // State
  values: T;
  touched: Record<keyof T, boolean>;
  errors: Record<keyof T, ValidationError | null>;
  isSubmitting: boolean;
  isValid: boolean;

  // Methods
  setValue(field: keyof T, value: any): void;
  setTouched(field: keyof T, touched: boolean): void;
  validateField(field: keyof T): Promise<ValidationError | null>;
  validateForm(): Promise<Record<keyof T, ValidationError | null>>;
  handleBlur(field: keyof T): void;
  handleChange(field: keyof T, value: any): void;
  handleSubmit(event?: Event): Promise<void>;
  reset(): void;
  subscribe(listener: (state: FormState<T>) => void): () => void;
}

/**
 * Create a form instance with validation
 *
 * This is the core form runtime that manages:
 * - Form values
 * - Touch state
 * - Validation errors
 * - Submit handling
 */
export function createForm<T extends Record<string, any>>(
  config: FormConfig<T>,
): Form<T> {
  const {
    schema,
    defaultValues,
    onSubmit,
    validateOnBlur = true,
    validateOnChange = false,
  } = config;

  // Internal state
  let state: FormState<T> = {
    values: { ...defaultValues },
    touched: Object.keys(defaultValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>,
    ),
    errors: Object.keys(defaultValues).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<keyof T, ValidationError | null>,
    ),
    isSubmitting: false,
    isValid: true,
  };

  // Subscribers for reactive updates
  const listeners = new Set<(state: FormState<T>) => void>();

  /**
   * Notify all subscribers of state change
   */
  function notify(): void {
    listeners.forEach((listener) => listener(state));
  }

  /**
   * Update isValid flag based on errors
   */
  function updateValidity(): void {
    state.isValid = Object.values(state.errors).every(
      (error) => error === null,
    );
  }

  /**
   * Validate a single field
   */
  async function validateField(
    field: keyof T,
  ): Promise<ValidationError | null> {
    const path = [String(field)];
    const result = await Validator.validateAtPath(schema, state.values, path);

    if (!result.success && result.errors && result.errors.length > 0) {
      // Return the first error for this field
      return result.errors[0];
    }

    return null;
  }

  /**
   * Validate entire form
   */
  async function validateForm(): Promise<
    Record<keyof T, ValidationError | null>
  > {
    const result = await Validator.validate(schema, state.values);
    const fieldErrors: Record<keyof T, ValidationError | null> = {
      ...state.errors,
    };

    // Clear all errors first
    for (const key in fieldErrors) {
      fieldErrors[key] = null;
    }

    // Populate errors from validation result
    if (!result.success && result.errors) {
      for (const error of result.errors) {
        if (error.path.length > 0) {
          const fieldName = error.path[0] as keyof T;
          if (fieldName in fieldErrors) {
            fieldErrors[fieldName] = error;
          }
        }
      }
    }

    return fieldErrors;
  }

  /**
   * Set field value
   */
  function setValue(field: keyof T, value: any): void {
    state.values[field] = value;

    if (validateOnChange) {
      validateField(field).then((error) => {
        state.errors[field] = error;
        updateValidity();
        notify();
      });
    }

    notify();
  }

  /**
   * Set field touched state
   */
  function setTouched(field: keyof T, touched: boolean): void {
    state.touched[field] = touched;
    notify();
  }

  /**
   * Handle field blur event
   */
  function handleBlur(field: keyof T): void {
    state.touched[field] = true;

    if (validateOnBlur) {
      validateField(field).then((error) => {
        state.errors[field] = error;
        updateValidity();
        notify();
      });
    } else {
      notify();
    }
  }

  /**
   * Handle field change event
   */
  function handleChange(field: keyof T, value: any): void {
    setValue(field, value);
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    for (const key in state.values) {
      state.touched[key] = true;
    }

    // Validate entire form
    state.errors = await validateForm();
    updateValidity();
    state.isSubmitting = true;
    notify();

    // If valid, call onSubmit
    if (state.isValid) {
      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }

    state.isSubmitting = false;
    notify();
  }

  /**
   * Reset form to default values
   */
  function reset(): void {
    state = {
      values: { ...defaultValues },
      touched: Object.keys(defaultValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>,
      ),
      errors: Object.keys(defaultValues).reduce(
        (acc, key) => ({ ...acc, [key]: null }),
        {} as Record<keyof T, ValidationError | null>,
      ),
      isSubmitting: false,
      isValid: true,
    };
    notify();
  }

  /**
   * Subscribe to form state changes
   */
  function subscribe(listener: (state: FormState<T>) => void): () => void {
    listeners.add(listener);

    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
    };
  }

  // Return form instance
  return {
    get values() {
      return state.values;
    },
    get touched() {
      return state.touched;
    },
    get errors() {
      return state.errors;
    },
    get isSubmitting() {
      return state.isSubmitting;
    },
    get isValid() {
      return state.isValid;
    },
    setValue,
    setTouched,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    handleSubmit,
    reset,
    subscribe,
  };
}
