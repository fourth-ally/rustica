/**
 * Schema Builder Tests
 */

import { describe, it, before } from "node:test";
import assert from "node:assert";
import { r, type Infer } from "../src/index";

describe("Schema Builders", () => {
  describe("String Schema", () => {
    it("should create basic string schema", () => {
      const schema = r.string();
      const json = schema.toJSON();
      assert.strictEqual(json.type, "string");
    });

    it("should add min constraint", () => {
      const schema = r.string().min(5);
      const json = schema.toJSON();
      assert.strictEqual(json.min, 5);
    });

    it("should add max constraint", () => {
      const schema = r.string().max(100);
      const json = schema.toJSON();
      assert.strictEqual(json.max, 100);
    });

    it("should chain min and max", () => {
      const schema = r.string().min(5).max(100);
      const json = schema.toJSON();
      assert.strictEqual(json.min, 5);
      assert.strictEqual(json.max, 100);
    });

    it("should add email validation", () => {
      const schema = r.string().email();
      const json = schema.toJSON();
      assert.strictEqual(json.email, true);
    });

    it("should add url validation", () => {
      const schema = r.string().url();
      const json = schema.toJSON();
      assert.strictEqual(json.url, true);
    });

    it("should add pattern validation", () => {
      const schema = r.string().pattern("^[a-z]+$");
      const json = schema.toJSON();
      assert.strictEqual(json.pattern, "^[a-z]+$");
    });

    it("should add UI config", () => {
      const schema = r
        .string()
        .ui({ label: "Email", placeholder: "Enter email" });
      const json = schema.toJSON();
      assert.strictEqual(json.ui?.label, "Email");
      assert.strictEqual(json.ui?.placeholder, "Enter email");
    });

    it("should chain all methods", () => {
      const schema = r.string().min(3).max(50).email().ui({ label: "Email" });
      const json = schema.toJSON();
      assert.strictEqual(json.type, "string");
      assert.strictEqual(json.min, 3);
      assert.strictEqual(json.max, 50);
      assert.strictEqual(json.email, true);
      assert.strictEqual(json.ui?.label, "Email");
    });
  });

  describe("Number Schema", () => {
    it("should create basic number schema", () => {
      const schema = r.number();
      const json = schema.toJSON();
      assert.strictEqual(json.type, "number");
    });

    it("should add min constraint", () => {
      const schema = r.number().min(0);
      const json = schema.toJSON();
      assert.strictEqual(json.min, 0);
    });

    it("should add max constraint", () => {
      const schema = r.number().max(100);
      const json = schema.toJSON();
      assert.strictEqual(json.max, 100);
    });

    it("should add integer constraint", () => {
      const schema = r.number().integer();
      const json = schema.toJSON();
      assert.strictEqual(json.integer, true);
    });

    it("should add positive constraint", () => {
      const schema = r.number().positive();
      const json = schema.toJSON();
      assert.strictEqual(json.positive, true);
    });

    it("should chain all number methods", () => {
      const schema = r.number().min(0).max(120).integer().positive();
      const json = schema.toJSON();
      assert.strictEqual(json.min, 0);
      assert.strictEqual(json.max, 120);
      assert.strictEqual(json.integer, true);
      assert.strictEqual(json.positive, true);
    });
  });

  describe("Boolean Schema", () => {
    it("should create boolean schema", () => {
      const schema = r.boolean();
      const json = schema.toJSON();
      assert.strictEqual(json.type, "boolean");
    });

    it("should support UI config", () => {
      const schema = r.boolean().ui({ label: "Accept terms" });
      const json = schema.toJSON();
      assert.strictEqual(json.ui?.label, "Accept terms");
    });
  });

  describe("Object Schema", () => {
    it("should create object schema", () => {
      const schema = r.object({
        name: r.string(),
        age: r.number(),
      });
      const json = schema.toJSON();
      assert.strictEqual(json.type, "object");
      assert(json.shape);
      assert(json.shape.name);
      assert(json.shape.age);
    });

    it("should handle nested objects", () => {
      const schema = r.object({
        user: r.object({
          name: r.string(),
          email: r.string().email(),
        }),
      });
      const json = schema.toJSON();
      assert.strictEqual(json.type, "object");
      assert.strictEqual(json.shape.user.type, "object");
      assert((json.shape.user as any).shape.name);
      assert((json.shape.user as any).shape.email);
    });

    it("should preserve all field constraints", () => {
      const schema = r.object({
        email: r.string().min(5).email(),
        age: r.number().min(18).integer(),
        agreed: r.boolean(),
      });
      const json = schema.toJSON();
      assert.strictEqual((json.shape.email as any).min, 5);
      assert.strictEqual((json.shape.email as any).email, true);
      assert.strictEqual((json.shape.age as any).min, 18);
      assert.strictEqual((json.shape.age as any).integer, true);
      assert.strictEqual(json.shape.agreed.type, "boolean");
    });
  });

  describe("Type Inference", () => {
    it("should infer string type", () => {
      const schema = r.string();
      type Inferred = Infer<typeof schema>;
      const value: Inferred = "test";
      assert.strictEqual(typeof value, "string");
    });

    it("should infer number type", () => {
      const schema = r.number();
      type Inferred = Infer<typeof schema>;
      const value: Inferred = 42;
      assert.strictEqual(typeof value, "number");
    });

    it("should infer boolean type", () => {
      const schema = r.boolean();
      type Inferred = Infer<typeof schema>;
      const value: Inferred = true;
      assert.strictEqual(typeof value, "boolean");
    });

    it("should infer object type", () => {
      const schema = r.object({
        name: r.string(),
        age: r.number(),
        active: r.boolean(),
      });
      type Inferred = Infer<typeof schema>;
      const value: Inferred = {
        name: "John",
        age: 30,
        active: true,
      };
      assert.strictEqual((value as any).name, "John");
      assert.strictEqual((value as any).age, 30);
      assert.strictEqual((value as any).active, true);
    });
  });
});
