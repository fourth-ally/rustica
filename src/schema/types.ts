/**
 * Schema types matching Rust Schema enum
 */

export interface UiConfig {
  label?: string;
  placeholder?: string;
  description?: string;
}

export interface StringMessages {
  invalid_type?: string;
  min?: string;
  max?: string;
  email?: string;
  url?: string;
  pattern?: string;
}

export interface NumberMessages {
  invalid_type?: string;
  min?: string;
  max?: string;
  integer?: string;
  positive?: string;
}

export interface BooleanMessages {
  invalid_type?: string;
}

export interface ObjectMessages {
  invalid_type?: string;
  required?: string;
}

export interface StringSchema {
  type: "string";
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  pattern?: string;
  ui?: UiConfig;
  messages?: StringMessages;
}

export interface NumberSchema {
  type: "number";
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  ui?: UiConfig;
  messages?: NumberMessages;
}

export interface BooleanSchema {
  type: "boolean";
  ui?: UiConfig;
  messages?: BooleanMessages;
}

export interface ObjectSchema {
  type: "object";
  shape: Record<string, Schema>;
  ui?: UiConfig;
  messages?: ObjectMessages;
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
