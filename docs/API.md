# API Reference

## Schema Builders

### `z.string()`

Create a string schema with validation rules.

```typescript
const schema = r.string()
  .min(3)           // Minimum length
  .max(100)         // Maximum length
  .email()          // Email validation
  .url()            // URL validation
  .pattern('regex') // Pattern matching
  .ui({ label: 'Name' }); // UI metadata
```

### `z.number()`

Create a number schema with validation rules.

```typescript
const schema = r.number()
  .min(0)          // Minimum value
  .max(100)        // Maximum value
  .integer()       // Must be integer
  .positive()      // Must be positive
  .ui({ label: 'Age' });
```

### `z.boolean()`

Create a boolean schema.

```typescript
const schema = r.boolean()
  .ui({ label: 'Accept terms' });
```

### `z.object()`

Create an object schema with nested fields.

```typescript
const schema = r.object({
  name: r.string().min(2),
  email: r.string().email(),
  age: r.number().min(18).integer()
});
```

## Type Inference

Use the `Infer` utility to extract TypeScript types from schemas:

```typescript
const userSchema = r.object({
  name: r.string(),
  age: r.number()
});

type User = r.Infer<typeof userSchema>;
// Equivalent to: { name: string; age: number }
```

## Validator

### `Validator.validate(schema, value)`

Validate data against a schema.

```typescript
const result = Validator.validate(schema, data);

if (result.success) {
  console.log('Valid!');
} else {
  console.log('Errors:', result.errors);
}
```

### `Validator.validateAtPath(schema, value, path)`

Validate a specific field in an object.

```typescript
const result = Validator.validateAtPath(
  userSchema,
  { name: 'John', email: 'invalid' },
  ['email']
);
```

### `Validator.parse(schema, value)`

Validate and throw on error.

```typescript
try {
  const user = Validator.parse(userSchema, data);
  // user is typed correctly
} catch (error) {
  console.error(error.message);
}
```

### `Validator.safeParse(schema, value)`

Validate and return result object.

```typescript
const result = Validator.safeParse(userSchema, data);

if (result.success) {
  const user = result.data; // Typed correctly
} else {
  const errors = result.errors;
}
```

## Form Runtime

### `createForm(config)`

Create a framework-agnostic form instance.

```typescript
const form = createForm({
  schema: userSchema,
  defaultValues: { name: '', email: '' },
  onSubmit: async (data) => {
    console.log(data);
  },
  validateOnBlur: true,
  validateOnChange: false
});

// Access state
console.log(form.values);
console.log(form.errors);
console.log(form.touched);

// Update values
form.setValue('name', 'John');
form.handleBlur('email');

// Submit
await form.handleSubmit();

// Subscribe to changes
const unsubscribe = form.subscribe((state) => {
  console.log('Form state changed:', state);
});
```

## React Hook

### `useWasmForm(config)`

React hook for form management.

```typescript
function MyForm() {
  const form = useWasmForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
    onSubmit: async (data) => {
      // Handle submission
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email')} />
      {form.errors.email && <span>{form.errors.email.message}</span>}
      
      <button type="submit" disabled={form.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### Form API

#### `register(name)`

Register a field with the form. Returns props to spread on input elements.

```typescript
<input {...form.register('email')} />
// Equivalent to:
// <input
//   name="email"
//   value={form.values.email}
//   onChange={(e) => form.handleChange('email', e.target.value)}
//   onBlur={(e) => form.handleBlur('email')}
// />
```

#### `setValue(field, value)`

Programmatically set a field value.

```typescript
form.setValue('email', 'test@example.com');
```

#### `setError(field, error)`

Programmatically set a field error (useful for async validation).

```typescript
form.setError('email', {
  path: ['email'],
  code: 'custom',
  message: 'Email already exists'
});
```

#### `handleSubmit(event)`

Handle form submission. Validates all fields and calls `onSubmit` if valid.

```typescript
<form onSubmit={form.handleSubmit}>
```

#### `reset()`

Reset form to initial state.

```typescript
<button type="button" onClick={form.reset}>Reset</button>
```

### Utility Hooks

#### `useFieldError(form, field)`

Get error message for a field (returns null if not touched or no error).

```typescript
const emailError = useFieldError(form, 'email');
```

#### `useFieldHasError(form, field)`

Check if field has an error.

```typescript
const hasError = useFieldHasError(form, 'email');
```

## Initialization

### `initWasm()`

Initialize the WASM module. Must be called before validation.

```typescript
import { initWasm } from 'rustica';

await initWasm();
```

### `createValidator()`

Auto-initializing validator (convenience method).

```typescript
import { createValidator } from 'rustica';

const Validator = await createValidator();
const result = Validator.validate(schema, data);
```

## Error Structure

Validation errors follow this structure:

```typescript
interface ValidationError {
  path: string[];      // Path to the field (e.g., ['user', 'email'])
  code: string;        // Error code (e.g., 'string.email')
  message: string;     // Human-readable message
}
```

### Error Codes

- `invalid_type` - Wrong data type
- `required` - Missing required field
- `string.min` - String too short
- `string.max` - String too long
- `string.email` - Invalid email
- `string.url` - Invalid URL
- `string.pattern` - Pattern mismatch
- `number.min` - Number too small
- `number.max` - Number too large
- `number.integer` - Not an integer
- `number.positive` - Not positive
- `parse_error` - JSON parse error
- `invalid_path` - Invalid path in schema
