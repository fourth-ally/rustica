import { describe, it, before } from "node:test";
import assert from "node:assert";
import { r, Validator, initWasm } from "../src";

describe("Custom Error Messages", async () => {
  // Initialize WASM before running tests
  await initWasm();

  describe("String validation messages", () => {
    it("should use custom invalid_type message", async () => {
      const schema = r.string().messages({
        invalid_type: "Please provide text, not a number",
      });

      const result = await Validator.validate(schema, 123);
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Please provide text, not a number",
      );
      assert.strictEqual(result.errors?.[0].code, "invalid_type");
    });

    it("should use custom min length message", async () => {
      const schema = r.string().min(5).messages({
        min: "Username must be at least 5 characters long",
      });

      const result = await Validator.validate(schema, "abc");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Username must be at least 5 characters long",
      );
      assert.strictEqual(result.errors?.[0].code, "string.min");
    });

    it("should use custom max length message", async () => {
      const schema = r.string().max(10).messages({
        max: "Username cannot exceed 10 characters",
      });

      const result = await Validator.validate(schema, "verylongusername");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Username cannot exceed 10 characters",
      );
      assert.strictEqual(result.errors?.[0].code, "string.max");
    });

    it("should use custom email message", async () => {
      const schema = r.string().email().messages({
        email: "Please enter a valid email address like user@example.com",
      });

      const result = await Validator.validate(schema, "notanemail");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Please enter a valid email address like user@example.com",
      );
      assert.strictEqual(result.errors?.[0].code, "string.email");
    });

    it("should use custom URL message", async () => {
      const schema = r.string().url().messages({
        url: "Please provide a valid URL starting with http:// or https://",
      });

      const result = await Validator.validate(schema, "notaurl");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Please provide a valid URL starting with http:// or https://",
      );
      assert.strictEqual(result.errors?.[0].code, "string.url");
    });

    it("should use custom pattern message", async () => {
      const schema = r.string().pattern("test").messages({
        pattern: 'String must contain the word "test"',
      });

      const result = await Validator.validate(schema, "hello world");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        'String must contain the word "test"',
      );
      assert.strictEqual(result.errors?.[0].code, "string.pattern");
    });

    it("should use default messages when custom messages not provided", async () => {
      const schema = r.string().min(5);

      const result = await Validator.validate(schema, "abc");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "String must be at least 5 characters",
      );
    });
  });

  describe("Number validation messages", () => {
    it("should use custom invalid_type message", async () => {
      const schema = r.number().messages({
        invalid_type: "Age must be a number",
      });

      const result = await Validator.validate(schema, "twenty");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.[0].message, "Age must be a number");
      assert.strictEqual(result.errors?.[0].code, "invalid_type");
    });

    it("should use custom min value message", async () => {
      const schema = r.number().min(18).messages({
        min: "You must be at least 18 years old",
      });

      const result = await Validator.validate(schema, 16);
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "You must be at least 18 years old",
      );
      assert.strictEqual(result.errors?.[0].code, "number.min");
    });

    it("should use custom max value message", async () => {
      const schema = r.number().max(100).messages({
        max: "Age cannot exceed 100",
      });

      const result = await Validator.validate(schema, 150);
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.[0].message, "Age cannot exceed 100");
      assert.strictEqual(result.errors?.[0].code, "number.max");
    });

    it("should use custom integer message", async () => {
      const schema = r.number().integer().messages({
        integer: "Quantity must be a whole number",
      });

      const result = await Validator.validate(schema, 3.14);
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Quantity must be a whole number",
      );
      assert.strictEqual(result.errors?.[0].code, "number.integer");
    });

    it("should use custom positive message", async () => {
      const schema = r.number().positive().messages({
        positive: "Price must be greater than zero",
      });

      const result = await Validator.validate(schema, -10);
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Price must be greater than zero",
      );
      assert.strictEqual(result.errors?.[0].code, "number.positive");
    });

    it("should use default messages when custom messages not provided", async () => {
      const schema = r.number().min(0);

      const result = await Validator.validate(schema, -5);
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Number must be at least 0",
      );
    });
  });

  describe("Boolean validation messages", () => {
    it("should use custom invalid_type message", async () => {
      const schema = r.boolean().messages({
        invalid_type: "Please select yes or no",
      });

      const result = await Validator.validate(schema, "maybe");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.[0].message, "Please select yes or no");
      assert.strictEqual(result.errors?.[0].code, "invalid_type");
    });

    it("should use default message when custom message not provided", async () => {
      const schema = r.boolean();

      const result = await Validator.validate(schema, "yes");
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.[0].message, "Expected boolean");
    });
  });

  describe("Object validation messages", () => {
    it("should use custom invalid_type message", async () => {
      const schema = r
        .object({
          name: r.string(),
        })
        .messages({
          invalid_type: "User data must be an object",
        });

      const result = await Validator.validate(schema, "not an object");
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "User data must be an object",
      );
      assert.strictEqual(result.errors?.[0].code, "invalid_type");
    });

    it("should use custom required field message", async () => {
      const schema = r
        .object({
          email: r.string(),
        })
        .messages({
          required: "This field is mandatory",
        });

      const result = await Validator.validate(schema, {});
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.[0].message, "This field is mandatory");
      assert.strictEqual(result.errors?.[0].code, "required");
    });

    it("should use default message when custom message not provided", async () => {
      const schema = r.object({
        email: r.string(),
      });

      const result = await Validator.validate(schema, {});
      assert.strictEqual(result.success, false);
      assert.strictEqual(
        result.errors?.[0].message,
        "Field 'email' is required",
      );
    });

    it("should support custom messages on nested fields", async () => {
      const schema = r.object({
        email: r.string().email().messages({
          email: "Invalid email format for user registration",
        }),
        age: r.number().min(18).messages({
          min: "You must be 18 or older to register",
        }),
      });

      const result = await Validator.validate(schema, {
        email: "bademail",
        age: 16,
      });

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.errors?.length, 2);

      const emailError = result.errors?.find((e) => e.path.includes("email"));
      assert.strictEqual(
        emailError?.message,
        "Invalid email format for user registration",
      );

      const ageError = result.errors?.find((e) => e.path.includes("age"));
      assert.strictEqual(
        ageError?.message,
        "You must be 18 or older to register",
      );
    });
  });

  describe("Mixed validation with custom messages", () => {
    it("should handle complex form with multiple custom messages", async () => {
      const registrationSchema = r.object({
        username: r.string().min(3).max(20).messages({
          invalid_type: "Username must be text",
          min: "Username too short - minimum 3 characters",
          max: "Username too long - maximum 20 characters",
        }),
        email: r.string().email().messages({
          invalid_type: "Email must be text",
          email: "Please enter a valid email address",
        }),
        age: r.number().min(13).max(120).integer().messages({
          invalid_type: "Age must be a number",
          min: "You must be at least 13 years old",
          max: "Please enter a realistic age",
          integer: "Age must be a whole number",
        }),
        website: r.string().url().messages({
          url: "Website must start with http:// or https://",
        }),
        agreed: r.boolean().messages({
          invalid_type: "You must accept the terms",
        }),
      });

      const result = await Validator.validate(registrationSchema, {
        username: "ab",
        email: "notanemail",
        age: 12.5,
        website: "badurl",
        agreed: "yes",
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.errors);
      assert.ok(result.errors.length > 0);

      // Check specific error messages
      const usernameError = result.errors?.find((e) =>
        e.path.includes("username"),
      );
      assert.strictEqual(
        usernameError?.message,
        "Username too short - minimum 3 characters",
      );

      const emailError = result.errors?.find((e) => e.path.includes("email"));
      assert.strictEqual(
        emailError?.message,
        "Please enter a valid email address",
      );

      const ageErrors = result.errors?.filter((e) => e.path.includes("age"));
      assert.ok(ageErrors?.some((e) => e.message.includes("13 years old")));
      assert.ok(ageErrors?.some((e) => e.message.includes("whole number")));
    });

    it("should pass validation when all values are correct", async () => {
      const schema = r.object({
        username: r.string().min(3).messages({
          min: "Username too short",
        }),
        age: r.number().min(18).messages({
          min: "Must be 18+",
        }),
      });

      const result = await Validator.validate(schema, {
        username: "validuser",
        age: 25,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.errors, undefined);
    });
  });

  describe("Partial custom messages", () => {
    it("should use custom message for some validations and defaults for others", async () => {
      const schema = r.string().min(5).max(10).email().messages({
        min: "Too short!",
        // max and email will use default messages
      });

      const resultMin = await Validator.validate(schema, "abc");
      assert.strictEqual(resultMin.success, false);
      assert.strictEqual(resultMin.errors?.[0].message, "Too short!");

      const resultMax = await Validator.validate(
        schema,
        "verylongemailaddress",
      );
      assert.strictEqual(resultMax.success, false);
      assert.strictEqual(
        resultMax.errors?.[0].message,
        "String must be at most 10 characters",
      );
    });
  });
});
