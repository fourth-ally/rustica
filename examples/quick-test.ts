#!/usr/bin/env node

/**
 * Quick test script to verify the validator works
 * Run with: node --loader tsx examples/quick-test.ts
 */

import { r, Validator, initWasm } from "../src/index.js";

async function runTests() {
  console.log("Initializing WASM...");
  await initWasm();
  console.log("WASM initialized!\n");

  // Test 1: Basic string validation
  console.log("Test 1: String validation");
  const stringSchema = r.string().min(5);

  const test1a = await Validator.validate(stringSchema, "hello");
  console.log('  "hello" (min 5):', test1a.success ? "✓ PASS" : "✗ FAIL");

  const test1b = await Validator.validate(stringSchema, "hi");
  console.log('  "hi" (min 5):', !test1b.success ? "✓ PASS" : "✗ FAIL");

  // Test 2: Email validation
  console.log("\nTest 2: Email validation");
  const emailSchema = r.string().email();

  const test2a = await Validator.validate(emailSchema, "test@example.com");
  console.log('  "test@example.com":', test2a.success ? "✓ PASS" : "✗ FAIL");

  const test2b = await Validator.validate(emailSchema, "notanemail");
  console.log('  "notanemail":', !test2b.success ? "✓ PASS" : "✗ FAIL");

  // Test 3: Number validation
  console.log("\nTest 3: Number validation");
  const numberSchema = r.number().min(0).max(100);

  const test3a = await Validator.validate(numberSchema, 50);
  console.log("  50 (0-100):", test3a.success ? "✓ PASS" : "✗ FAIL");

  const test3b = await Validator.validate(numberSchema, 150);
  console.log("  150 (0-100):", !test3b.success ? "✓ PASS" : "✗ FAIL");

  // Test 4: Object validation
  console.log("\nTest 4: Object validation");
  const userSchema = r.object({
    name: r.string().min(2),
    age: r.number().min(0).integer(),
  });

  const test4a = await Validator.validate(userSchema, {
    name: "John",
    age: 30,
  });
  console.log("  Valid object:", test4a.success ? "✓ PASS" : "✗ FAIL");

  const test4b = await Validator.validate(userSchema, { name: "J", age: -5 });
  console.log("  Invalid object:", !test4b.success ? "✓ PASS" : "✗ FAIL");

  // Test 5: Field-level validation
  console.log("\nTest 5: Field-level validation");
  const formData = { name: "Jane", age: 25 };

  const test5 = await Validator.validateAtPath(userSchema, formData, ["name"]);
  console.log("  Field validation:", test5.success ? "✓ PASS" : "✗ FAIL");

  console.log("\n=== All tests completed ===");
}

runTests().catch(console.error);
