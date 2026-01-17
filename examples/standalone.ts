import { z, Validator, initWasm, type Infer } from "../src/index";

/**
 * Standalone validation examples (no React required)
 */

// Initialize WASM module
await initWasm();

console.log("=== Rust-JS Validator Examples ===\n");

// Example 1: Simple string validation
console.log("Example 1: String validation");
const emailSchema = z.string().min(3).email();

const validEmail = Validator.safeParse(emailSchema, "test@example.com");
console.log("Valid email:", validEmail);

const invalidEmail = Validator.safeParse(emailSchema, "invalid");
console.log("Invalid email:", invalidEmail);
console.log("");

// Example 2: Number validation
console.log("Example 2: Number validation");
const ageSchema = z.number().min(0).max(120).integer();

const validAge = Validator.safeParse(ageSchema, 25);
console.log("Valid age:", validAge);

const invalidAge = Validator.safeParse(ageSchema, 150);
console.log("Invalid age:", invalidAge);
console.log("");

// Example 3: Object validation
console.log("Example 3: Object validation");
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).integer(),
  website: z.string().url(),
});

type User = Infer<typeof userSchema>;

const validUser: unknown = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  website: "https://example.com",
};

const result = Validator.safeParse(userSchema, validUser);
console.log("Valid user:", result);
console.log("");

// Example 4: Validation with errors
console.log("Example 4: Multiple validation errors");
const invalidUser: unknown = {
  name: "J", // Too short
  email: "invalid", // Not an email
  age: 15, // Too young
  website: "not-a-url", // Not a URL
};

const errorResult = Validator.validate(userSchema, invalidUser);
console.log("Validation result:", errorResult);
console.log("");

// Example 5: Field-level validation
console.log("Example 5: Field-level validation");
const formData = {
  name: "Jane",
  email: "invalid-email",
  age: 25,
  website: "https://example.com",
};

const emailValidation = Validator.validateAtPath(userSchema, formData, [
  "email",
]);
console.log("Email field validation:", emailValidation);
console.log("");

// Example 6: Parse with exception
console.log("Example 6: Parse with exception handling");
try {
  const parsed = Validator.parse(userSchema, { name: "X" });
  console.log("Parsed:", parsed);
} catch (error) {
  console.log(
    "Validation failed:",
    error instanceof Error ? error.message : String(error),
  );
}
console.log("");

// Example 7: Complex nested schema
console.log("Example 7: Complex validation rules");
const complexSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().min(5).email(),
  profile: z.object({
    bio: z.string().min(10).max(500),
    age: z.number().min(13).max(120).integer(),
    website: z.string().url(),
  }),
});

const complexData = {
  username: "johndoe",
  email: "john@example.com",
  profile: {
    bio: "Software engineer with 10 years of experience",
    age: 30,
    website: "https://johndoe.com",
  },
};

const complexResult = Validator.safeParse(complexSchema, complexData);
console.log("Complex validation:", complexResult.success ? "PASSED" : "FAILED");
if (!complexResult.success) {
  console.log("Errors:", complexResult.errors);
}
console.log("");

// Example 8: Performance test
console.log("Example 8: Performance test (1000 validations)");
const perfSchema = z.object({
  id: z.number().integer().positive(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  active: z.boolean(),
});

const perfData = {
  id: 123,
  name: "Test User",
  email: "test@example.com",
  active: true,
};

const startTime = performance.now();
for (let i = 0; i < 1000; i++) {
  Validator.validate(perfSchema, perfData);
}
const endTime = performance.now();

console.log(
  `1000 validations completed in ${(endTime - startTime).toFixed(2)}ms`,
);
console.log(
  `Average: ${((endTime - startTime) / 1000).toFixed(3)}ms per validation`,
);
console.log("");

console.log("=== All examples completed ===");
