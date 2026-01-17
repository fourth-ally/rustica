# Contributing to Rust-JS Validator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+
- wasm-pack
- Git

### Setup Development Environment

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/rustica.git
   cd rustica
   ```

2. **Run setup script**

   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Verify build**
   ```bash
   make test
   ```

## Development Workflow

### Making Changes

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Rust code: `src/*.rs`
   - TypeScript code: `src/**/*.ts`
   - Tests: `tests/*.test.ts` or `src/**/*.rs` (Rust tests)

3. **Build and test**

   ```bash
   make build
   make test
   ```

4. **Format code**
   ```bash
   make format
   ```

### Code Style

#### Rust

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Run `cargo fmt` before committing
- Run `cargo clippy` and fix warnings
- Add documentation comments for public APIs

```rust
/// Validates a string against the schema
///
/// # Arguments
/// * `s` - The string to validate
/// * `min` - Minimum length
///
/// # Returns
/// Validation result
fn validate_string(s: &str, min: Option<usize>) -> ValidationResult {
    // ...
}
```

#### TypeScript

- Follow [TypeScript best practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- Use ESLint and Prettier
- Add JSDoc comments for exported functions

```typescript
/**
 * Validate data against a schema
 *
 * @param schema - Schema definition
 * @param value - Data to validate
 * @returns Validation result with errors if any
 */
export function validate<T>(schema: Schema, value: unknown): ValidationResult {
  // ...
}
```

### Testing

#### Rust Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_string_validation() {
        let schema = Schema::String { min: Some(3), max: None, ... };
        let result = Validator::validate(&schema, &json!("hello"));
        assert!(result.is_ok());
    }
}
```

Run with:

```bash
cargo test
```

#### TypeScript Tests

```typescript
import { test } from "node:test";
import { z, Validator, initWasm } from "../src/index";

test("validates email", async () => {
  await initWasm();
  const schema = z.string().email();
  const result = Validator.validate(schema, "test@example.com");
  assert(result.success);
});
```

Run with:

```bash
npm run test:ts
```

### Documentation

- Update relevant documentation in `docs/`
- Add examples to `examples/` if introducing new features
- Update README.md if changing public API
- Add inline comments for complex logic

## Pull Request Process

1. **Update documentation**
   - Add/update API docs
   - Update CHANGELOG.md
   - Add examples if needed

2. **Ensure tests pass**

   ```bash
   make test
   ```

3. **Create pull request**
   - Clear title and description
   - Reference related issues
   - Include breaking changes section if applicable

4. **PR template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Rust tests pass
   - [ ] TypeScript tests pass
   - [ ] Manual testing completed

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] CHANGELOG.md updated
   ```

## Project Structure

```
rustica/
├── src/                  # Rust source
│   ├── lib.rs           # Module exports
│   ├── schema.rs        # Schema types
│   ├── validator.rs     # Validation logic
│   └── wasm.rs          # WASM bindings
├── src/                  # TypeScript source
│   ├── schema/          # Schema builders
│   ├── validator/       # WASM wrapper
│   ├── form/            # Form runtime
│   └── react/           # React hooks
├── tests/               # Test files
├── examples/            # Usage examples
└── docs/                # Documentation
```

## Adding Features

### New Schema Type

1. **Add to Rust enum** (`src/schema.rs`)

   ```rust
   pub enum Schema {
       // ... existing types
       Array {
           items: Box<Schema>,
           min_items: Option<usize>,
           max_items: Option<usize>,
       },
   }
   ```

2. **Add validation logic** (`src/validator.rs`)

   ```rust
   Schema::Array { items, min_items, max_items } => {
       // Validation logic
   }
   ```

3. **Add TypeScript builder** (`src/schema/builders.ts`)

   ```typescript
   export class ZArray<T> extends SchemaBuilder<T[]> {
     // Builder methods
   }
   ```

4. **Export in API** (`src/schema/index.ts`)

   ```typescript
   export const z = {
     // ... existing
     array<T>(items: SchemaBuilder<T>): ZArray<T> {
       return new ZArray(items);
     },
   };
   ```

5. **Add tests**
   - Rust: `src/validator.rs`
   - TypeScript: `tests/validator.test.ts`

6. **Update documentation**
   - API reference
   - Examples

### New Validation Rule

1. **Add to schema type** (`src/schema.rs`)

   ```rust
   String {
       // ... existing
       custom_rule: Option<String>,
   }
   ```

2. **Implement validation** (`src/validator.rs`)

   ```rust
   if let Some(rule) = custom_rule {
       // Validation
   }
   ```

3. **Add builder method** (`src/schema/builders.ts`)
   ```typescript
   customRule(rule: string): this {
       this.schema.custom_rule = rule;
       return this;
   }
   ```

## Release Process

1. **Update version**
   - `Cargo.toml`
   - `package.json`

2. **Update CHANGELOG.md**
   - Add version and date
   - List all changes

3. **Create tag**

   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0"
   git push origin v0.2.0
   ```

4. **Build release**

   ```bash
   make release
   ```

5. **Publish** (if applicable)
   ```bash
   npm publish
   cargo publish
   ```

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Check existing documentation first

## Resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WebAssembly](https://webassembly.org/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)

Thank you for contributing! 🎉
