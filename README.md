# Rustica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange)](https://www.rust-lang.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-✓-blueviolet)](https://webassembly.org/)

Production-grade schema and form validation system powered by Rust and WebAssembly.

## ✨ Features

<table>
<tr>
<td width="50%">

### 🦀 Rust Core

- **WASM-powered** validation
- **Zero-copy** architecture
- **~0.1-0.5ms** per validation
- **Single call** per validation

</td>
<td width="50%">

### 📝 TypeScript API

- **Fluent API** like Zod
- **Full type inference**
- **Schema serialization**
- **UI metadata** support

</td>
</tr>
<tr>
<td width="50%">

### ⚛️ React Integration

- **useWasmForm** hook
- **Field registration**
- **Auto re-rendering**
- **RHF-compatible** API

</td>
<td width="50%">

### 🔧 Framework Agnostic

- **createForm** for any framework
- **Vanilla JS** support
- **Node.js** compatible
- **Browser** ready

</td>
</tr>
</table>

## Installation

```bash
npm install rustica
```

## Quick Start

```typescript
import { r, useWasmForm } from 'rustica';

// Define schema with optional custom error messages
// WASM auto-initializes on first validation - no setup needed!
const loginSchema = r.object({
  email: r.string()
    .min(3)
    .email()
    .ui({ label: "Email" })
    .messages({
      email: "Please enter a valid email address",
      min: "Email must be at least 3 characters"
    }),
  password: r.string()
    .min(8)
    .ui({ label: "Password" })
    .messages({
      min: "Password must be at least 8 characters for security"
    })
});

// Infer types
type LoginForm = r.Infer<typeof loginSchema>;

// Use in React - works immediately!
function LoginForm() {
  const form = useWasmForm({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
    onSubmit: async (data) => {
      console.log('Valid data:', data);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.register('email')} />
      {form.errors.email && <span>{form.errors.email.message}</span>}

      <input type="password" {...form.register('password')} />
      {form.errors.password && <span>{form.errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

**Note**: WASM auto-initializes on the first validation call. For eager loading (optional), you can manually call `await initWasm()` at app startup.

````

## Custom Error Messages (Optional)

Customize validation error messages for better UX:

```typescript
// String validation with custom messages
const usernameSchema = r.string().min(3).max(20).messages({
  invalid_type: "Username must be text",
  min: "Username is too short - minimum 3 characters",
  max: "Username is too long - maximum 20 characters",
});

// Number validation with custom messages
const ageSchema = r.number().min(18).integer().messages({
  invalid_type: "Age must be a number",
  min: "You must be at least 18 years old",
  integer: "Age must be a whole number",
});

// Object validation with custom messages
const formSchema = r
  .object({
    email: r.string().email().messages({
      email: "Please enter a valid email like user@example.com",
    }),
    terms: r.boolean().messages({
      invalid_type: "You must accept the terms and conditions",
    }),
  })
  .messages({
    invalid_type: "Form data must be an object",
    required: "This field is required",
  });
````

**Available message keys by type:**

- **String**: `invalid_type`, `min`, `max`, `email`, `url`, `pattern`
- **Number**: `invalid_type`, `min`, `max`, `integer`, `positive`
- **Boolean**: `invalid_type`
- **Object**: `invalid_type`, `required`

If not provided, default messages are used. See [examples/custom-messages.ts](./examples/custom-messages.ts) for more examples.

## Building from Source

```bash
# Quick setup (recommended)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manual setup
npm install
npm run build
```

See [Getting Started Guide](./docs/GETTING_STARTED.md) for detailed instructions.

## Architecture

- **Rust Core** (`src/lib.rs`, `src/schema.rs`, `src/validator.rs`) - Schema definitions and validation logic
- **WASM Interface** (`src/wasm.rs`) - WebAssembly bindings with wasm-bindgen
- **TypeScript Schema Builder** (`src/schema/`) - Fluent API for schema definition
- **Form Runtime** (`src/form/`) - Form state management
- **React Hook** (`src/react/`) - React integration

## Documentation

- 📖 **[Complete Documentation Index](./docs/INDEX.md)** - All docs in one place
- 🚀 **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Quick start tutorial
- 📚 **[API Reference](./docs/API.md)** - Complete API documentation
- 🏗️ **[Architecture Guide](./docs/ARCHITECTURE.md)** - How it works
- 📊 **[Feature Comparison](./docs/COMPARISON.md)** - vs Zod, Yup, Joi
- 🤝 **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

## Project Structure

```
rustica/
├── src/                      # Rust source (validation core)
│   ├── lib.rs               # Module exports
│   ├── schema.rs            # Schema AST types
│   ├── validator.rs         # Validation engine
│   └── wasm.rs              # WASM bindings
├── src/                      # TypeScript source
│   ├── schema/              # Schema builders (r.string(), etc.)
│   ├── validator/           # WASM wrapper
│   ├── form/                # Form runtime
│   ├── react/               # React hooks
│   └── index.ts             # Main entry point
├── examples/                 # Usage examples
│   ├── quick-test.ts        # Basic validation tests
│   ├── standalone.ts        # Standalone examples
│   ├── forms.tsx            # Form component examples
│   └── react-form-app/      # Full React app with API integration
├── tests/                    # Test suite
├── docs/                     # Documentation
└── scripts/                  # Build scripts
```

## Commands

```bash
# Development
make install       # Install dependencies
make build         # Build WASM + TypeScript
make test          # Run all tests
make dev           # Watch mode

# Quick Commands
make example       # Run quick test
make clean         # Clean build artifacts
make help          # Show all commands
```

## Performance

<table>
<tr>
<td><b>Metric</b></td>
<td><b>Value</b></td>
<td><b>Notes</b></td>
</tr>
<tr>
<td>Validation Speed</td>
<td>~0.1-0.5ms</td>
<td>Per validation (warm)</td>
</tr>
<tr>
<td>Throughput</td>
<td>5,000-10,000/sec</td>
<td>1000 validations in ~100-200ms</td>
</tr>
<tr>
<td>WASM Size</td>
<td>~15-20KB</td>
<td>Gzipped: ~8-10KB</td>
</tr>
<tr>
<td>Overhead</td>
<td>Single call</td>
<td>Zero-copy where possible</td>
</tr>
</table>

See [Performance Comparison](./docs/COMPARISON.md) for detailed benchmarks.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Roadmap

- [x] Core validation (string, number, boolean, object)
- [x] React hooks
- [x] Form runtime
- [x] Type inference
- [x] Custom error messages (optional)
- [ ] Array/tuple schemas
- [ ] Union/intersection types
- [ ] Async validation helpers
- [ ] i18n support

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

MIT
