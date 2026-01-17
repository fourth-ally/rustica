# Rust-JS Validator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange)](https://www.rust-lang.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-✓-blueviolet)](https://webassembly.org/)

Production-grade Zod-like schema and form validation system powered by Rust and WebAssembly.

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

// Define schema
const loginSchema = r.object({
  email: r.string().min(3).email().ui({ label: "Email" }),
  password: r.string().min(8).ui({ label: "Password" })
});

// Infer types
type LoginForm = r.Infer<typeof loginSchema>;

// Use in React
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
- [ ] Array/tuple schemas
- [ ] Union/intersection types
- [ ] Async validation helpers
- [ ] i18n support

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

MIT
