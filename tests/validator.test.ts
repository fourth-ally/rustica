/**
 * Comprehensive test suite for Rust-JS Validator
 */

import { test, describe, before } from "node:test";
import assert from "node:assert";
import { r, Validator, initWasm, createForm, type Infer } from "../src/index";

// Initialize WASM before all tests
before(async () => {
  await initWasm();
});

const flushAsync = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("Schema Builders", () => {
  test("r.string() creates string schema", () => {
    const schema = r.string();
    const json = schema.toJSON();
    assert.strictEqual(json.type, "string");
  });

  test("r.string() with constraints", () => {
    const schema = r.string().min(3).max(10).email();
    const json = schema.toJSON();
    assert.strictEqual(json.min, 3);
    assert.strictEqual(json.max, 10);
    assert.strictEqual(json.email, true);
  });

  test("r.number() creates number schema", () => {
    const schema = r.number();
    const json = schema.toJSON();
    assert.strictEqual(json.type, "number");
  });

  test("r.number() with constraints", () => {
    const schema = r.number().min(0).max(100).integer();
    const json = schema.toJSON();
    assert.strictEqual(json.min, 0);
    assert.strictEqual(json.max, 100);
    assert.strictEqual(json.integer, true);
  });

  test("r.boolean() creates boolean schema", () => {
    const schema = r.boolean();
    const json = schema.toJSON();
    assert.strictEqual(json.type, "boolean");
  });

  test("r.object() creates object schema", () => {
    const schema = r.object({
      name: r.string(),
      age: r.number(),
    });
    const json = schema.toJSON();
    assert.strictEqual(json.type, "object");
    assert(json.shape.name);
    assert(json.shape.age);
  });

  test("UI configuration", () => {
    const schema = r
      .string()
      .ui({ label: "Email", placeholder: "test@example.com" });
    const json = schema.toJSON();
    assert.strictEqual(json.ui?.label, "Email");
    assert.strictEqual(json.ui?.placeholder, "test@example.com");
  });
});

describe("String Validation", () => {
  test("validates valid string", async () => {
    const schema = r.string();
    const result = await Validator.validate(schema, "hello");
    assert.strictEqual(result.success, true);
  });

  test("rejects non-string", async () => {
    const schema = r.string();
    const result = await Validator.validate(schema, 123);
    assert.strictEqual(result.success, false);
    assert(result.errors?.[0].code === "invalid_type");
  });

  test("validates min length", async () => {
    const schema = r.string().min(5);
    assert.strictEqual(
      (await Validator.validate(schema, "hello")).success,
      true,
    );
    assert.strictEqual((await Validator.validate(schema, "hi")).success, false);
  });

  test("validates max length", async () => {
    const schema = r.string().max(5);
    assert.strictEqual(
      (await Validator.validate(schema, "hello")).success,
      true,
    );
    assert.strictEqual(
      (await Validator.validate(schema, "toolong")).success,
      false,
    );
  });

  test("validates email", async () => {
    const schema = r.string().email();
    assert.strictEqual(
      (await Validator.validate(schema, "test@example.com")).success,
      true,
    );
    assert.strictEqual(
      (await Validator.validate(schema, "invalid")).success,
      false,
    );
  });

  test("validates URL", async () => {
    const schema = r.string().url();
    assert.strictEqual(
      (await Validator.validate(schema, "https://example.com")).success,
      true,
    );
    assert.strictEqual(
      (await Validator.validate(schema, "not-a-url")).success,
      false,
    );
  });
});

describe("Number Validation", () => {
  test("validates valid number", async () => {
    const schema = r.number();
    const result = await Validator.validate(schema, 42);
    assert.strictEqual(result.success, true);
  });

  test("rejects non-number", async () => {
    const schema = r.number();
    const result = await Validator.validate(schema, "not a number");
    assert.strictEqual(result.success, false);
  });

  test("validates min value", async () => {
    const schema = r.number().min(10);
    assert.strictEqual((await Validator.validate(schema, 15)).success, true);
    assert.strictEqual((await Validator.validate(schema, 5)).success, false);
  });

  test("validates max value", async () => {
    const schema = r.number().max(100);
    assert.strictEqual((await Validator.validate(schema, 50)).success, true);
    assert.strictEqual((await Validator.validate(schema, 150)).success, false);
  });

  test("validates integer", async () => {
    const schema = r.number().integer();
    assert.strictEqual((await Validator.validate(schema, 42)).success, true);
    assert.strictEqual((await Validator.validate(schema, 42.5)).success, false);
  });

  test("validates positive", async () => {
    const schema = r.number().positive();
    assert.strictEqual((await Validator.validate(schema, 5)).success, true);
    assert.strictEqual((await Validator.validate(schema, -5)).success, false);
    assert.strictEqual((await Validator.validate(schema, 0)).success, false);
  });
});

describe("Boolean Validation", () => {
  test("validates valid boolean", async () => {
    const schema = r.boolean();
    assert.strictEqual((await Validator.validate(schema, true)).success, true);
    assert.strictEqual((await Validator.validate(schema, false)).success, true);
  });

  test("rejects non-boolean", async () => {
    const schema = r.boolean();
    assert.strictEqual(
      (await Validator.validate(schema, "true")).success,
      false,
    );
    assert.strictEqual((await Validator.validate(schema, 1)).success, false);
  });
});

describe("Object Validation", () => {
  test("validates valid object", async () => {
    const schema = r.object({
      name: r.string(),
      age: r.number(),
    });
    const result = await Validator.validate(schema, { name: "John", age: 30 });
    assert.strictEqual(result.success, true);
  });

  test("rejects invalid object", async () => {
    const schema = r.object({
      name: r.string(),
      age: r.number(),
    });
    const result = await Validator.validate(schema, {
      name: "John",
      age: "thirty",
    });
    assert.strictEqual(result.success, false);
  });

  test("requires all fields", async () => {
    const schema = r.object({
      name: r.string(),
      age: r.number(),
    });
    const result = await Validator.validate(schema, { name: "John" });
    assert.strictEqual(result.success, false);
    assert(result.errors?.some((e) => e.code === "required"));
  });

  test("validates nested objects", async () => {
    const schema = r.object({
      user: r.object({
        name: r.string(),
        email: r.string().email(),
      }),
    });
    const result = await Validator.validate(schema, {
      user: { name: "John", email: "john@example.com" },
    });
    assert.strictEqual(result.success, true);
  });
});

describe("Path Validation", () => {
  test("validates at specific path", async () => {
    const schema = r.object({
      email: r.string().email(),
    });
    const data = { email: "test@example.com" };
    const result = await Validator.validateAtPath(schema, data, ["email"]);
    assert.strictEqual(result.success, true);
  });

  test("detects error at specific path", async () => {
    const schema = r.object({
      email: r.string().email(),
    });
    const data = { email: "invalid" };
    const result = await Validator.validateAtPath(schema, data, ["email"]);
    assert.strictEqual(result.success, false);
  });

  test("validates nested path", async () => {
    const schema = r.object({
      user: r.object({
        email: r.string().email(),
      }),
    });
    const data = { user: { email: "test@example.com" } };
    const result = await Validator.validateAtPath(schema, data, [
      "user",
      "email",
    ]);
    assert.strictEqual(result.success, true);
  });
});

describe("Validator Methods", () => {
  test("parse() returns data on success", async () => {
    const schema = r.string();
    const result = await Validator.parse(schema, "hello");
    assert.strictEqual(result, "hello");
  });

  test("parse() throws on failure", async () => {
    const schema = r.string().email();
    await assert.rejects(async () => {
      await Validator.parse(schema, "invalid");
    });
  });

  test("safeParse() returns success result", async () => {
    const schema = r.string();
    const result = await Validator.safeParse(schema, "hello");
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data, "hello");
    }
  });

  test("safeParse() returns error result", async () => {
    const schema = r.string().email();
    const result = await Validator.safeParse(schema, "invalid");
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert(result.errors.length > 0);
    }
  });
});

describe("Type Inference", () => {
  test("infers string type", () => {
    const schema = r.string();
    type Inferred = Infer<typeof schema>;
    const value: Inferred = "test";
    assert.strictEqual(typeof value, "string");
  });

  test("infers number type", () => {
    const schema = r.number();
    type Inferred = Infer<typeof schema>;
    const value: Inferred = 42;
    assert.strictEqual(typeof value, "number");
  });

  test("infers object type", () => {
    const schema = r.object({
      name: r.string(),
      age: r.number(),
    });
    type Inferred = Infer<typeof schema>;
    const value: Inferred = { name: "John", age: 30 };
    assert.strictEqual((value as any).name, "John");
    assert.strictEqual((value as any).age, 30);
  });
});

describe("Form Runtime", () => {
  test("creates form with default values", () => {
    const schema = r.object({
      name: r.string(),
      email: r.string(),
    });
    const form = createForm({
      schema,
      defaultValues: { name: "", email: "" },
      onSubmit: () => {},
    });
    assert.strictEqual(form.values.name, "");
    assert.strictEqual(form.values.email, "");
  });

  test("sets field value", () => {
    const schema = r.object({ name: r.string() });
    const form = createForm({
      schema,
      defaultValues: { name: "" },
      onSubmit: () => {},
    });
    form.setValue("name", "John");
    assert.strictEqual(form.values.name, "John");
  });

  test("validates field on blur", async () => {
    const schema = r.object({
      email: r.string().email(),
    });
    const form = createForm({
      schema,
      defaultValues: { email: "" },
      onSubmit: () => {},
      validateOnBlur: true,
    });
    form.setValue("email", "invalid");
    form.handleBlur("email");
    await flushAsync();
    assert(form.errors.email !== null);
  });

  test("validates entire form", async () => {
    const schema = r.object({
      name: r.string().min(2),
      email: r.string().email(),
    });
    const form = createForm({
      schema,
      defaultValues: { name: "J", email: "invalid" },
      onSubmit: () => {},
    });
    const errors = await form.validateForm();
    assert(errors.name !== null);
    assert(errors.email !== null);
  });

  test("calls onSubmit with valid data", async () => {
    let submitted = false;
    const schema = r.object({ name: r.string() });
    const form = createForm({
      schema,
      defaultValues: { name: "John" },
      onSubmit: (data) => {
        submitted = true;
        assert.strictEqual(data.name, "John");
      },
    });
    await form.handleSubmit();
    assert(submitted);
  });

  test("subscribes to form changes", () => {
    let notified = false;
    const schema = r.object({ name: r.string() });
    const form = createForm({
      schema,
      defaultValues: { name: "" },
      onSubmit: () => {},
    });
    const unsubscribe = form.subscribe(() => {
      notified = true;
    });
    form.setValue("name", "John");
    assert(notified);
    unsubscribe();
  });
});

describe("Error Structure", () => {
  test("error has correct structure", async () => {
    const schema = r.string().email();
    const result = await Validator.validate(schema, "invalid");
    assert.strictEqual(result.success, false);
    if (result.errors) {
      const error = result.errors[0];
      assert(Array.isArray(error.path));
      assert(typeof error.code === "string");
      assert(typeof error.message === "string");
    }
  });

  test("error includes path", async () => {
    const schema = r.object({
      user: r.object({
        email: r.string().email(),
      }),
    });
    const result = await Validator.validate(schema, {
      user: { email: "invalid" },
    });
    assert.strictEqual(result.success, false);
    if (result.errors) {
      const error = result.errors[0];
      assert(error.path.includes("email"));
    }
  });
});

describe("Performance", () => {
  test("validates quickly", async () => {
    const schema = r.object({
      name: r.string(),
      email: r.string().email(),
      age: r.number().min(0).max(120),
    });
    const data = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      await Validator.validate(schema, data);
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    // Should validate in less than 1ms on average
    assert(avgTime < 1, `Average validation time ${avgTime}ms exceeds 1ms`);
  });
});
