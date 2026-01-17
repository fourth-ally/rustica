/**
 * Example: Custom Error Messages in Rustica
 *
 * This example demonstrates how to provide custom error messages
 * for better user experience in forms and validation.
 */

import { r } from "../src";

// Example 1: Simple custom messages for a registration form
const registrationSchema = r.object({
  username: r.string().min(3).max(20).messages({
    invalid_type: "Username must be text",
    min: "Username is too short - please use at least 3 characters",
    max: "Username is too long - maximum 20 characters allowed",
  }),

  email: r.string().email().messages({
    invalid_type: "Please provide a text value for email",
    email: "Please enter a valid email address (e.g., user@example.com)",
  }),

  age: r.number().min(13).max(120).integer().messages({
    invalid_type: "Age must be a number",
    min: "You must be at least 13 years old to register",
    max: "Please enter a realistic age",
    integer: "Age must be a whole number",
  }),

  termsAccepted: r.boolean().messages({
    invalid_type: "You must check the terms and conditions box",
  }),
});

// Example 2: E-commerce product schema with custom messages
const productSchema = r.object({
  name: r.string().min(1).max(100).messages({
    min: "Product name is required",
    max: "Product name is too long",
  }),

  price: r.number().min(0.01).positive().messages({
    min: "Price must be at least $0.01",
    positive: "Price must be a positive amount",
  }),

  quantity: r.number().integer().min(1).messages({
    integer: "Quantity must be a whole number",
    min: "At least 1 item is required",
  }),
});

// Example 3: Multilingual messages (French)
const userProfileSchemaFR = r.object({
  nom: r.string().min(2).messages({
    invalid_type: "Le nom doit être du texte",
    min: "Le nom doit contenir au moins 2 caractères",
  }),

  email: r.string().email().messages({
    email: "Veuillez saisir une adresse e-mail valide",
  }),

  age: r.number().min(18).messages({
    min: "Vous devez avoir au moins 18 ans",
  }),
});

// Example 4: Partial custom messages (mix of custom and defaults)
const settingsSchema = r.object({
  displayName: r.string().min(1).max(50).messages({
    min: "Display name cannot be empty",
    // max will use default message: "String must be at most 50 characters"
  }),

  bio: r.string().max(500).messages({
    max: "Bio is too long - please keep it under 500 characters",
    // min will use default if specified
  }),

  website: r.string().url().messages({
    url: "Please enter a valid website URL (must start with http:// or https://)",
  }),
});

// Export schemas for use in applications
export {
  registrationSchema,
  productSchema,
  userProfileSchemaFR,
  settingsSchema,
};

// Usage example (commented out as this is just a demo):
/*
import { Validator } from '../src';

async function validateUserInput() {
  const result = await Validator.validate(registrationSchema, {
    username: 'ab', // Too short
    email: 'not-an-email',
    age: 12, // Too young
    termsAccepted: 'yes', // Wrong type
  });

  if (!result.success) {
    console.log('Validation errors with custom messages:');
    result.errors?.forEach(error => {
      console.log(`- ${error.path.join('.')}: ${error.message}`);
    });
    // Output:
    // - username: Username is too short - please use at least 3 characters
    // - email: Please enter a valid email address (e.g., user@example.com)
    // - age: You must be at least 13 years old to register
    // - termsAccepted: You must check the terms and conditions box
  }
}
*/
