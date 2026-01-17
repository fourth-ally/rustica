import type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  UiConfig,
  StringMessages,
  NumberMessages,
  BooleanMessages,
  ObjectMessages,
} from "./types";

/**
 * Base class for all schema builders
 */
export abstract class SchemaBuilder<T> {
  abstract toJSON(): any;

  /**
   * Add UI configuration for forms
   */
  abstract ui(config: UiConfig): this;
}

/**
 * String schema builder with fluent API
 */
export class ZString extends SchemaBuilder<string> {
  private schema: StringSchema;

  constructor() {
    super();
    this.schema = { type: "string" };
  }

  /**
   * Set minimum length constraint
   */
  min(length: number): this {
    this.schema.min = length;
    return this;
  }

  /**
   * Set maximum length constraint
   */
  max(length: number): this {
    this.schema.max = length;
    return this;
  }

  /**
   * Mark as email validation
   */
  email(): this {
    this.schema.email = true;
    return this;
  }

  /**
   * Mark as URL validation
   */
  url(): this {
    this.schema.url = true;
    return this;
  }

  /**
   * Add pattern matching
   */
  pattern(regex: string): this {
    this.schema.pattern = regex;
    return this;
  }

  /**
   * Add UI configuration
   */
  ui(config: UiConfig): this {
    this.schema.ui = config;
    return this;
  }

  /**
   * Add custom error messages
   */
  messages(messages: StringMessages): this {
    this.schema.messages = messages;
    return this;
  }

  /**
   * Serialize to JSON for Rust validation
   */
  toJSON(): StringSchema {
    return { ...this.schema };
  }
}

/**
 * Number schema builder with fluent API
 */
export class ZNumber extends SchemaBuilder<number> {
  private schema: NumberSchema;

  constructor() {
    super();
    this.schema = { type: "number" };
  }

  /**
   * Set minimum value constraint
   */
  min(value: number): this {
    this.schema.min = value;
    return this;
  }

  /**
   * Set maximum value constraint
   */
  max(value: number): this {
    this.schema.max = value;
    return this;
  }

  /**
   * Require integer values only
   */
  integer(): this {
    this.schema.integer = true;
    return this;
  }

  /**
   * Require positive values only
   */
  positive(): this {
    this.schema.positive = true;
    return this;
  }

  /**
   * Add UI configuration
   */
  ui(config: UiConfig): this {
    this.schema.ui = config;
    return this;
  }

  /**
   * Add custom error messages
   */
  messages(messages: NumberMessages): this {
    this.schema.messages = messages;
    return this;
  }

  /**
   * Serialize to JSON for Rust validation
   */
  toJSON(): NumberSchema {
    return { ...this.schema };
  }
}

/**
 * Boolean schema builder with fluent API
 */
export class ZBoolean extends SchemaBuilder<boolean> {
  private schema: BooleanSchema;

  constructor() {
    super();
    this.schema = { type: "boolean" };
  }

  /**
   * Add UI configuration
   */
  ui(config: UiConfig): this {
    this.schema.ui = config;
    return this;
  }

  /**
   * Add custom error messages
   */
  messages(messages: BooleanMessages): this {
    this.schema.messages = messages;
    return this;
  }

  /**
   * Serialize to JSON for Rust validation
   */
  toJSON(): BooleanSchema {
    return { ...this.schema };
  }
}

/**
 * Object schema builder with fluent API
 */
export class ZObject<
  T extends Record<string, SchemaBuilder<any>>,
> extends SchemaBuilder<{
  [K in keyof T]: T[K] extends SchemaBuilder<infer U> ? U : never;
}> {
  private schema: ObjectSchema;

  constructor(shape: T) {
    super();

    // Convert SchemaBuilder instances to their JSON representation
    const jsonShape: Record<string, any> = {};
    for (const [key, value] of Object.entries(shape)) {
      jsonShape[key] = value.toJSON();
    }

    this.schema = {
      type: "object",
      shape: jsonShape,
    };
  }

  /**
   * Add UI configuration
   */
  ui(config: UiConfig): this {
    this.schema.ui = config;
    return this;
  }

  /**
   * Add custom error messages
   */
  messages(messages: ObjectMessages): this {
    this.schema.messages = messages;
    return this;
  }

  /**
   * Serialize to JSON for Rust validation
   */
  toJSON(): ObjectSchema {
    return { ...this.schema };
  }
}
