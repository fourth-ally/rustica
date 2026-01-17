import { ZString, ZNumber, ZBoolean, ZObject, SchemaBuilder } from "./builders";

/**
 * Main schema builder API (Rustica-style)
 *
 * Usage:
 * ```typescript
 * const schema = r.object({
 *   email: r.string().min(3).email(),
 *   age: r.number().min(0).integer()
 * });
 * ```
 */
export const r = {
  /**
   * Create a string schema
   */
  string(): ZString {
    return new ZString();
  },

  /**
   * Create a number schema
   */
  number(): ZNumber {
    return new ZNumber();
  },

  /**
   * Create a boolean schema
   */
  boolean(): ZBoolean {
    return new ZBoolean();
  },

  /**
   * Create an object schema
   */
  object<T extends Record<string, SchemaBuilder<any>>>(shape: T): ZObject<T> {
    return new ZObject(shape);
  },
};

// Keep 'z' and 'n' as aliases for backwards compatibility
export const z = r;
export const n = r;

// Type inference utility
export type Infer<T> = T extends SchemaBuilder<infer U> ? U : never;

// Re-export builders for advanced usage
export { ZString, ZNumber, ZBoolean, ZObject, SchemaBuilder };
export type { UiConfig } from "./types";
export * from "./types";
