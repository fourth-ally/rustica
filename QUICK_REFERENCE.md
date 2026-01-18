# Quick Reference Card

## 🚀 Installation & Setup

```bash
npm install rustica
```

```typescript
import { r, Validator } from "rustica";
// No initialization needed - WASM auto-loads on first validation!
```

## 📝 Schema Definition

```typescript
import { r } from "rustica";

// String
r.string()
  .min(3)
  .max(100)
  .email()
  .url()
  .pattern("regex")
  .ui({ label: "Email" });

// Number
r.number().min(0).max(100).integer().positive().ui({ label: "Age" });

// Boolean
r.boolean().ui({ label: "Accept" });

// Object
r.object({
  name: r.string(),
  age: r.number(),
});
```

## ✅ Validation

```typescript
import { Validator } from "rustica";

// Standard validation (async)
const result = await Validator.validate(schema, data);
if (result.success) {
  /* valid */
}

// Field-level validation
const result = await Validator.validateAtPath(schema, data, ["email"]);

// Parse (throws on error)
const data = await Validator.parse(schema, input);

// Safe parse (returns result)
const result = await Validator.safeParse(schema, input);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.errors);
}
```

## 🎯 Type Inference

```typescript
import { r, type Infer } from "rustica";

const userSchema = r.object({
  name: r.string(),
  age: r.number(),
});

type User = Infer<typeof userSchema>;
// Type: { name: string; age: number }
```

## ⚛️ React Forms

```typescript
import { useWasmForm } from 'rustica';

function MyForm() {
  const form = useWasmForm({
    schema: mySchema,
    defaultValues: { email: '', password: '' },
    onSubmit: async (data) => {
      console.log(data);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email')} />
      {form.errors.email && (
        <span>{form.errors.email.message}</span>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔧 Non-React Forms

```typescript
import { createForm } from "rustica";

const form = createForm({
  schema: mySchema,
  defaultValues: { email: "" },
  onSubmit: (data) => console.log(data),
  validateOnBlur: true,
});

// Update value
form.setValue("email", "test@example.com");

// Validate field
const error = form.validateField("email");

// Handle blur
form.handleBlur("email");

// Submit
await form.handleSubmit();

// Subscribe to changes
const unsubscribe = form.subscribe((state) => {
  console.log(state);
});
```

## 📊 Form State

```typescript
// Values
form.values.email; // Current value

// Errors
form.errors.email; // ValidationError | null

// Touched
form.touched.email; // boolean

// Status
form.isSubmitting; // boolean
form.isValid; // boolean
```

## ❗ Error Structure

```typescript
interface ValidationError {
  path: string[]; // ['user', 'email']
  code: string; // 'string.email'
  message: string; // 'Invalid email address'
}
```

## 🔑 Error Codes

- `invalid_type` - Wrong data type
- `required` - Missing field
- `string.min` - Too short
- `string.max` - Too long
- `string.email` - Invalid email
- `string.url` - Invalid URL
- `string.pattern` - Pattern mismatch
- `number.min` - Too small
- `number.max` - Too large
- `number.integer` - Not an integer
- `number.positive` - Not positive

## 🎨 UI Metadata

```typescript
const schema = r.string().ui({
  label: "Email Address",
  placeholder: "you@example.com",
  description: "Your email",
});

// Access metadata
const metadata = schema.toJSON().ui;
```

## 🛠️ Validation Modes

```typescript
// On blur (default)
validateOnBlur: true

// On change
validateOnChange: true

// On submit only
validateOnBlur: false,
validateOnChange: false
```

## 💡 Common Patterns

### Server Errors

```typescript
const form = useWasmForm({
  schema,
  defaultValues,
  onSubmit: async (data) => {
    try {
      await api.submit(data);
    } catch (error) {
      form.setError("email", {
        path: ["email"],
        code: "custom.exists",
        message: "Email already exists",
      });
    }
  },
});
```

### Conditional Validation

```typescript
// Validate in JS wrapper
const result = Validator.validate(schema, data);
if (result.success && data.age < 18) {
  // Additional check
}
```

### Reset Form

```typescript
<button type="button" onClick={form.reset}>
  Reset
</button>
```

### Programmatic Validation

```typescript
// Validate specific field
const error = form.validateField("email");

// Validate entire form
const errors = form.validateForm();
```

## 🧪 Testing

```typescript
import { test } from "node:test";
import { r, Validator, initWasm } from "rustica";

test("validates email", async () => {
  await initWasm();
  const schema = r.string().email();
  const result = Validator.validate(schema, "test@example.com");
  assert(result.success);
});
```

## 📦 Build Commands

```bash
make build         # Build WASM + TypeScript
make test          # Run all tests
make example       # Run quick test
make dev           # Watch mode
make clean         # Clean artifacts
make help          # Show all commands
```

## 📚 Documentation

- **Getting Started**: `docs/GETTING_STARTED.md`
- **API Reference**: `docs/API.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Examples**: `examples/`

## 🔗 Quick Links

- [Full Documentation](./docs/INDEX.md)
- [API Reference](./docs/API.md)
- [Examples](./examples/)
- [Contributing](./CONTRIBUTING.md)

## 💻 Example Projects

### Login Form

```typescript
const loginSchema = r.object({
  email: r.string().email(),
  password: r.string().min(8),
});

type LoginData = Infer<typeof loginSchema>;
```

### User Profile

```typescript
const profileSchema = r.object({
  name: r.string().min(2),
  age: r.number().min(18).integer(),
  website: r.string().url(),
});
```

### Contact Form

```typescript
const contactSchema = r.object({
  name: r.string().min(2),
  email: r.string().email(),
  message: r.string().min(10),
});
```

---

**Need More Help?** Check the [complete documentation](./docs/INDEX.md)
