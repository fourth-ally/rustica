/**
 * Schema types matching Rust Schema enum
 */

export interface UiConfig {
  label?: string;
  placeholder?: string;
  description?: string;
}

export interface StringSchema {
  type: 'string';
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  pattern?: string;
  ui?: UiConfig;
}

export interface NumberSchema {
  type: 'number';
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  ui?: UiConfig;
}

export interface BooleanSchema {
  type: 'boolean';
  ui?: UiConfig;
}

export interface ObjectSchema {
  type: 'object';
  shape: Record<string, Schema>;
  ui?: UiConfig;
}

export type Schema = StringSchema | NumberSchema | BooleanSchema | ObjectSchema;

export interface ValidationError {
  path: string[];
  code: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
}
