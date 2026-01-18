# Getting Started

## Prerequisites

- **Node.js** 18+ 
- **Rust** 1.70+ (for building from source)
- **wasm-pack** (for building WASM)

## Installation

### From NPM (when published)

```bash
npm install rustica
```

### From Source

```bash
# Clone the repository
git clone <repository-url>
cd rustica

# Install dependencies
npm install

# Build WASM and TypeScript
npm run build
```

## Quick Start

### 1. Define a Schema

Use the `r` builder to define validation schemas.

**Note:** WASM auto-initializes on first validation - no manual setup needed!

```typescript
import { r } from 'rustica';

const userSchema = r.object({
  name: r.string().min(2).max(50),
  email: r.string().email(),
  age: r.number().min(18).integer(),
});
```

### 2. Validate Data

Use the `Validator` to check your data. All validation methods are async:

```typescript
import { Validator } from 'rustica';

const result = await Validator.validate(userSchema, {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

if (result.success) {
  console.log('Valid!');
} else {
  console.log('Errors:', result.errors);
}
```

### 3. Type-Safe Forms

Get full TypeScript type inference:

```typescript
import { r, type Infer } from 'rustica';

const schema = r.object({
  email: r.string().email(),
  password: r.string().min(8)
});

type LoginData = Infer<typeof schema>;
// Type: { email: string; password: string }
```

## React Integration

### Basic Form

```typescript
import { r, useWasmForm } from 'rustica';

// No initialization needed - WASM loads automatically on first validation!

const loginSchema = r.object({
  email: r.string().email(),
  password: r.string().min(8)
});

function LoginForm() {
  const form = useWasmForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async (data) => {
      console.log('Login:', data);
      // Call your API
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <label>Email</label>
        <input {...form.register('email')} />
        {form.errors.email && (
          <span>{form.errors.email.message}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...form.register('password')} />
        {form.errors.password && (
          <span>{form.errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting}>
        Login
      </button>
    </form>
  );
}
```

### With UI Metadata

Add UI configuration for better form generation:

```typescript
const schema = r.object({
  email: r.string()
    .email()
    .ui({
      label: 'Email Address',
      placeholder: 'you@example.com',
      description: 'We will never share your email'
    }),
  password: r.string()
    .min(8)
    .ui({
      label: 'Password',
      placeholder: 'At least 8 characters'
    })
});
```

## Non-React Usage

The validator works without React:

```typescript
import { createForm } from 'rustica';

const form = createForm({
  schema: mySchema,
  defaultValues: { /* ... */ },
  onSubmit: (data) => {
    console.log(data);
  }
});

// Update values
form.setValue('email', 'test@example.com');

// Validate field
const error = form.validateField('email');

// Submit
await form.handleSubmit();

// Subscribe to changes
form.subscribe((state) => {
  console.log('Form state:', state);
});
```

## Validation Patterns

### Safe Parse

Returns a result object instead of throwing:

```typescript
const result = Validator.safeParse(schema, data);

if (result.success) {
  // result.data is typed correctly
  console.log(result.data);
} else {
  // result.errors contains validation errors
  console.log(result.errors);
}
```

### Parse with Exception

Throws on validation failure:

```typescript
try {
  const data = Validator.parse(schema, untrustedData);
  // data is validated and typed
} catch (error) {
  console.error(error.message);
}
```

### Field-Level Validation

Validate individual fields (useful for forms):

```typescript
const result = Validator.validateAtPath(
  schema,
  formData,
  ['email']  // Path to field
);

if (!result.success) {
  console.log('Email error:', result.errors[0].message);
}
```

## Schema Composition

Build complex schemas from simple ones:

```typescript
// Base schemas
const emailSchema = r.string().email();
const passwordSchema = r.string().min(8);

// Composed schema
const authSchema = r.object({
  email: emailSchema,
  password: passwordSchema
});

// Nested objects
const userProfileSchema = r.object({
  personal: r.object({
    name: r.string().min(2),
    age: r.number().min(0).integer()
  }),
  contact: r.object({
    email: emailSchema,
    phone: r.string()
  })
});
```

## Validation Modes

### On Blur (default)

Validate when user leaves the field:

```typescript
const form = useWasmForm({
  schema,
  defaultValues,
  onSubmit,
  validateOnBlur: true  // default
});
```

### On Change

Validate as user types:

```typescript
const form = useWasmForm({
  schema,
  defaultValues,
  onSubmit,
  validateOnChange: true
});
```

### On Submit Only

Only validate when form is submitted:

```typescript
const form = useWasmForm({
  schema,
  defaultValues,
  onSubmit,
  validateOnBlur: false,
  validateOnChange: false
});
```

## Error Handling

### Display Errors

```typescript
{form.touched.email && form.errors.email && (
  <div className="error">
    {form.errors.email.message}
  </div>
)}
```

### Custom Error Messages

Handle errors programmatically:

```typescript
const result = Validator.validate(schema, data);

if (!result.success) {
  result.errors.forEach(error => {
    switch (error.code) {
      case 'string.email':
        console.log('Please enter a valid email');
        break;
      case 'string.min':
        console.log('Input is too short');
        break;
      default:
        console.log(error.message);
    }
  });
}
```

### Server-Side Errors

Set errors from API responses:

```typescript
const form = useWasmForm({
  schema,
  defaultValues,
  onSubmit: async (data) => {
    try {
      await api.register(data);
    } catch (error) {
      // Set server error
      form.setError('email', {
        path: ['email'],
        code: 'custom.exists',
        message: 'Email already exists'
      });
    }
  }
});
```

## Performance Tips

1. **Initialize WASM once** at app startup
2. **Reuse schemas** - don't recreate on every render
3. **Use field-level validation** for large forms
4. **Debounce onChange validation** if needed

```typescript
// Good: Create once outside component
const schema = r.object({ /* ... */ });

function MyComponent() {
  const form = useWasmForm({ schema, /* ... */ });
  // ...
}
```

```typescript
// Bad: Recreates schema on every render
function MyComponent() {
  const schema = r.object({ /* ... */ });
  const form = useWasmForm({ schema, /* ... */ });
  // ...
}
```

## Testing

### Test Schemas

```typescript
import { test } from 'node:test';
import { r, Validator, initWasm } from 'rustica';

test('validates email', async () => {
  await initWasm();
  
  const schema = r.string().email();
  const valid = Validator.validate(schema, 'test@example.com');
  const invalid = Validator.validate(schema, 'not-an-email');
  
  assert(valid.success);
  assert(!invalid.success);
});
```

### Test Forms

```typescript
import { renderHook, act } from '@testing-library/react';
import { useWasmForm, initWasm } from 'rustica';

beforeAll(async () => {
  await initWasm();
});

test('form validation', async () => {
  const { result } = renderHook(() =>
    useWasmForm({
      schema: loginSchema,
      defaultValues: { email: '', password: '' },
      onSubmit: vi.fn()
    })
  );

  act(() => {
    result.current.setValue('email', 'invalid');
    result.current.handleBlur('email');
  });

  expect(result.current.errors.email).toBeTruthy();
});
```

## Next Steps

- Read the [API Reference](./API.md) for complete API documentation
- Check [Architecture](./ARCHITECTURE.md) to understand how it works
- See [Examples](../examples/) for more complex use cases
- Browse the source code for implementation details

## Common Issues

### WASM not loading

**Error:** `Failed to load WASM module`

**Solution:** Make sure you've run `npm run build:wasm` and the `pkg/` directory exists.

### Type errors

**Error:** TypeScript complains about types

**Solution:** Make sure you've run `npm run build:ts` to generate type definitions.

### Validation not working

**Error:** Validator always returns success

**Solution:** Make sure you've called `await initWasm()` before validation.

## Support

- GitHub Issues: [Report bugs or request features]
- Discussions: [Ask questions or share ideas]
- Documentation: [API Reference](./API.md) | [Architecture](./ARCHITECTURE.md)
