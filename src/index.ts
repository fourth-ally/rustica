/**
 * Rustica
 * Production-grade schema and form validation powered by Rust and WebAssembly
 */

// Schema builder API
export { r, z, n, type Infer, type UiConfig } from "./schema";
export type {
  Schema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  ValidationError,
  ValidationResult,
} from "./schema/types";
export {
  ZString,
  ZNumber,
  ZBoolean,
  ZObject,
  SchemaBuilder,
} from "./schema/builders";

// Validator
export {
  Validator,
  ValidationException,
  initWasm,
  createValidator,
} from "./validator";

// Form runtime
export {
  createForm,
  type Form,
  type FormConfig,
  type FormState,
  type FieldState,
} from "./form";

// React hooks (optional peer dependency)
export {
  useWasmForm,
  useFieldError,
  useFieldHasError,
  type UseWasmFormReturn,
  type FieldRegistration,
} from "./react";
