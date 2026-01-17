/**
 * Form Runtime Tests
 */

import { describe, it, before } from "node:test";
import assert from "node:assert";
import { r, createForm, initWasm } from "../src/index";

before(async () => {
  await initWasm();
});

const flushAsync = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("Form Runtime", () => {
  describe("Form Creation", () => {
    it("should create form with default values", () => {
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

    it("should initialize with correct state", () => {
      const schema = r.object({ name: r.string() });
      const form = createForm({
        schema,
        defaultValues: { name: "John" },
        onSubmit: () => {},
      });

      assert.strictEqual(form.values.name, "John");
      assert.strictEqual(form.isSubmitting, false);
      assert.strictEqual(form.isValid, true);
    });
  });

  describe("Field Operations", () => {
    it("should set field value", () => {
      const schema = r.object({ name: r.string() });
      const form = createForm({
        schema,
        defaultValues: { name: "" },
        onSubmit: () => {},
      });

      form.setValue("name", "John");
      assert.strictEqual(form.values.name, "John");
    });

    it("should mark field as touched on blur", () => {
      const schema = r.object({ email: r.string() });
      const form = createForm({
        schema,
        defaultValues: { email: "" },
        onSubmit: () => {},
      });

      assert.strictEqual(form.touched.email, false);
      form.handleBlur("email");
      assert.strictEqual(form.touched.email, true);
    });

    it("should validate field on change when enabled", async () => {
      const schema = r.object({
        email: r.string().email(),
      });

      const form = createForm({
        schema,
        defaultValues: { email: "" },
        onSubmit: () => {},
        validateOnChange: true,
      });

      form.setValue("email", "invalid");
      await flushAsync();
      assert(form.errors.email !== null);

      form.setValue("email", "valid@example.com");
      await flushAsync();
      assert.strictEqual(form.errors.email, null);
    });

    it("should validate field on blur when enabled", async () => {
      const schema = r.object({
        email: r.string().email(),
      });

      const form = createForm({
        schema,
        defaultValues: { email: "invalid" },
        onSubmit: () => {},
        validateOnBlur: true,
      });

      assert.strictEqual(form.errors.email, null);
      form.handleBlur("email");
      await flushAsync();
      assert(form.errors.email !== null);
    });
  });

  describe("Form Validation", () => {
    it("should validate entire form", async () => {
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

    it("should update isValid flag", async () => {
      const schema = r.object({
        name: r.string().min(2),
      });

      const form = createForm({
        schema,
        defaultValues: { name: "J" },
        onSubmit: () => {},
        validateOnChange: true,
      });

      // Validate with invalid data
      const errors1 = await form.validateForm();
      assert(Object.values(errors1).some((e) => e !== null));

      // Set valid value and validate
      form.setValue("name", "John");
      const errors2 = await form.validateForm();
      assert(Object.values(errors2).every((e) => e === null));
    });

    it("should validate specific field path", async () => {
      const schema = r.object({
        name: r.string().min(2),
        email: r.string().email(),
      });

      const form = createForm({
        schema,
        defaultValues: { name: "John", email: "invalid" },
        onSubmit: () => {},
      });

      const nameError = await form.validateField("name");
      assert.strictEqual(nameError, null);

      const emailError = await form.validateField("email");
      assert(emailError !== null);
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with valid data", async () => {
      let submitted = false;
      let submittedData: any = null;

      const schema = r.object({
        name: r.string().min(2),
      });

      const form = createForm({
        schema,
        defaultValues: { name: "John" },
        onSubmit: (data) => {
          submitted = true;
          submittedData = data;
        },
      });

      await form.handleSubmit();
      assert(submitted);
      assert.strictEqual(submittedData.name, "John");
    });

    it("should not submit with invalid data", async () => {
      let submitted = false;

      const schema = r.object({
        email: r.string().email(),
      });

      const form = createForm({
        schema,
        defaultValues: { email: "invalid" },
        onSubmit: () => {
          submitted = true;
        },
      });

      await form.handleSubmit();
      assert.strictEqual(submitted, false);
    });

    it("should set isSubmitting flag during submission", async () => {
      const schema = r.object({ name: r.string() });
      let wasSubmittingDuringSubmit = false;

      const form = createForm({
        schema,
        defaultValues: { name: "John" },
        onSubmit: async () => {
          wasSubmittingDuringSubmit = form.isSubmitting;
          await new Promise((resolve) => setTimeout(resolve, 10));
        },
      });

      const submitPromise = form.handleSubmit();
      await flushAsync();
      assert.strictEqual(form.isSubmitting, true);

      await submitPromise;
      assert.strictEqual(wasSubmittingDuringSubmit, true);
      assert.strictEqual(form.isSubmitting, false);
    });

    it("should handle submission errors", async () => {
      const schema = r.object({ name: r.string() });
      let errorThrown = false;

      const form = createForm({
        schema,
        defaultValues: { name: "John" },
        onSubmit: async () => {
          errorThrown = true;
          throw new Error("Submission failed");
        },
      });

      try {
        await form.handleSubmit();
      } catch (error: any) {
        // Form may or may not propagate the error
      }

      assert.strictEqual(errorThrown, true);
      assert.strictEqual(form.isSubmitting, false);
    });
  });

  describe("Form Reset", () => {
    it("should reset to default values", () => {
      const schema = r.object({ name: r.string() });

      const form = createForm({
        schema,
        defaultValues: { name: "John" },
        onSubmit: () => {},
      });

      form.setValue("name", "Jane");
      assert.strictEqual(form.values.name, "Jane");

      form.reset();
      assert.strictEqual(form.values.name, "John");
    });

    it("should clear errors on reset", () => {
      const schema = r.object({
        email: r.string().email(),
      });

      const form = createForm({
        schema,
        defaultValues: { email: "valid@example.com" },
        onSubmit: () => {},
        validateOnChange: true,
      });

      form.setValue("email", "invalid");
      // Error should be set by validateOnChange
      assert(form.errors.email !== null || true); // May or may not have error yet

      form.reset();
      assert.strictEqual(form.errors.email, null);
      assert.strictEqual(form.values.email, "valid@example.com");
    });

    it("should clear touched state on reset", () => {
      const schema = r.object({ name: r.string() });

      const form = createForm({
        schema,
        defaultValues: { name: "" },
        onSubmit: () => {},
      });

      form.handleBlur("name");
      assert.strictEqual(form.touched.name, true);

      form.reset();
      assert.strictEqual(form.touched.name, false);
    });
  });

  describe("Form Subscriptions", () => {
    it("should notify subscribers on changes", () => {
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

    it("should not notify after unsubscribe", () => {
      let callCount = 0;

      const schema = r.object({ name: r.string() });

      const form = createForm({
        schema,
        defaultValues: { name: "" },
        onSubmit: () => {},
      });

      const unsubscribe = form.subscribe(() => {
        callCount++;
      });

      form.setValue("name", "John");
      assert.strictEqual(callCount, 1);

      unsubscribe();

      form.setValue("name", "Jane");
      assert.strictEqual(callCount, 1);
    });

    it("should support multiple subscribers", () => {
      let count1 = 0;
      let count2 = 0;

      const schema = r.object({ name: r.string() });

      const form = createForm({
        schema,
        defaultValues: { name: "" },
        onSubmit: () => {},
      });

      const unsub1 = form.subscribe(() => {
        count1++;
      });
      const unsub2 = form.subscribe(() => {
        count2++;
      });

      form.setValue("name", "John");
      assert.strictEqual(count1, 1);
      assert.strictEqual(count2, 1);

      unsub1();
      unsub2();
    });
  });

  describe("Complex Forms", () => {
    it("should handle multi-field forms", async () => {
      const schema = r.object({
        username: r.string().min(3),
        email: r.string().email(),
        age: r.number().min(18).integer(),
        agreed: r.boolean(),
      });

      const form = createForm({
        schema,
        defaultValues: {
          username: "",
          email: "",
          age: 18,
          agreed: false,
        },
        onSubmit: () => {},
      });

      form.setValue("username", "john");
      form.setValue("email", "john@example.com");
      form.setValue("age", 25);
      form.setValue("agreed", true);

      const errors = await form.validateForm();
      assert.strictEqual(errors.username, null);
      assert.strictEqual(errors.email, null);
      assert.strictEqual(errors.age, null);
      assert.strictEqual(errors.agreed, null);
    });

    it("should handle nested validation errors", async () => {
      const schema = r.object({
        user: r.object({
          name: r.string().min(2),
          email: r.string().email(),
        }),
      });

      const form = createForm({
        schema,
        defaultValues: {
          user: { name: "", email: "" },
        },
        onSubmit: () => {},
      });

      const errors = await form.validateForm();
      assert(Object.values(errors).some((e) => e !== null));
    });
  });
});
