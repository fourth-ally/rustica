# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-17

### Added

#### Core Validation

- Rust-based validation engine with Schema enum
- String validation (min, max, email, url, pattern)
- Number validation (min, max, integer, positive)
- Boolean validation
- Object validation with nested schemas
- Path-based validation for field-level checks
- Zod-like error structure with path, code, and message

#### WASM Interface

- `validate(schema_json, value_json)` - Full validation
- `validate_at_path(schema_json, value_json, path_json)` - Field validation
- JSON-only interface for zero-copy performance
- wasm-bindgen integration

#### TypeScript Schema Builder

- Fluent API with method chaining
- `z.string()` - String schema builder
- `z.number()` - Number schema builder
- `z.boolean()` - Boolean schema builder
- `z.object()` - Object schema builder
- UI metadata support with `.ui()` method
- Full JSON serialization with `.toJSON()`

#### Type System

- `Infer<T>` type utility for schema inference
- Full TypeScript type safety
- Compile-time type checking

#### Validator API

- `Validator.validate()` - Standard validation
- `Validator.validateAtPath()` - Field-level validation
- `Validator.parse()` - Parse and throw on error
- `Validator.safeParse()` - Parse and return result
- `initWasm()` - WASM initialization
- `createValidator()` - Auto-initializing wrapper

#### Form Runtime

- `createForm()` - Framework-agnostic form creation
- Field value management
- Touch state tracking
- Validation error tracking
- Submit handling with validation
- Validation modes (onBlur, onChange, onSubmit)
- Form state subscription
- Form reset functionality

#### React Integration

- `useWasmForm()` - React hook for forms
- Field registration with `register()`
- Automatic re-rendering on state changes
- React Hook Form-compatible API
- `useFieldError()` - Helper for error display
- `useFieldHasError()` - Helper for error checking

#### Documentation

- Getting Started guide
- Complete API reference
- Architecture documentation
- Contributing guidelines
- Multiple usage examples
- Inline code documentation

#### Build & Development

- Makefile with common commands
- Build scripts (build.sh, setup.sh)
- VS Code tasks configuration
- VS Code settings and extensions
- TypeScript configuration
- Cargo configuration with optimization
- NPM package configuration
- Git ignore configuration

#### Testing

- Comprehensive Rust test suite
- TypeScript test suite
- Quick test script
- Standalone examples
- React form examples
- Performance benchmarks

### Technical Details

#### Performance

- ~0.1-0.5ms per validation (warm)
- ~100-200ms for 1000 validations
- Optimized WASM build (~15-20KB gzipped)
- Single WASM call per validation

#### Architecture

- Clean separation of concerns (Rust/WASM/TS/React)
- Zero-copy validation where possible
- Schema as AST (not functions)
- No async in Rust
- Framework-agnostic core

## [Unreleased]

### Planned Features

- Array/tuple schemas
- Union/intersection types
- Conditional validation
- Custom error messages
- i18n support
- Schema composition utilities
- Async validation helpers
- Form field arrays
- Devtools integration

---

[0.1.0]: https://github.com/username/rustica/releases/tag/v0.1.0
