# System Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Vanilla JS  │  │   Node.js    │      │
│  │  Components  │  │   Frontend   │  │    Server    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
└─────────┼─────────────────┼──────────────────┼───────────────┘
          │                 │                  │
          └─────────────────┴──────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                  REACT INTEGRATION LAYER                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  useWasmForm()                                      │  │
│  │  - Field registration                               │  │
│  │  - State management                                 │  │
│  │  - React lifecycle integration                      │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────┐
│              FORM RUNTIME LAYER (Framework-agnostic)       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  createForm()                                       │  │
│  │  - Values: Record<string, any>                     │  │
│  │  - Touched: Record<string, boolean>                │  │
│  │  - Errors: Record<string, ValidationError>         │  │
│  │  - Validation modes (blur, change, submit)         │  │
│  │  - State subscription                              │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────┐
│                 TYPESCRIPT SCHEMA LAYER                    │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │z.string()│  │z.number()│  │z.boolean()│ │z.object()│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │               │              │        │
│  ┌────▼─────────────▼───────────────▼──────────────▼────┐  │
│  │         Schema Builder DSL                          │  │
│  │  - Fluent API (.min().max().email())              │  │
│  │  - Type inference (Infer<T>)                      │  │
│  │  - JSON serialization                             │  │
│  └────────────────────┬────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │
                    JSON Schema AST
                         │
┌────────────────────────▼──────────────────────────────────┐
│              VALIDATOR LAYER (TypeScript)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Validator.validate()                               │  │
│  │  Validator.validateAtPath()                         │  │
│  │  Validator.parse()                                  │  │
│  │  Validator.safeParse()                              │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │
              JSON strings (schema + value)
                         │
┌────────────────────────▼──────────────────────────────────┐
│                    WASM INTERFACE                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  WasmValidator                                      │  │
│  │  ├─ validate(schema_json, value_json)              │  │
│  │  └─ validate_at_path(schema_json, value_json,      │  │
│  │                       path_json)                    │  │
│  │                                                      │  │
│  │  Single call, zero-copy, JSON only                 │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │
                    JSON result
                         │
┌────────────────────────▼──────────────────────────────────┐
│                   RUST CORE (WebAssembly)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Schema (enum)                                      │  │
│  │  ├─ String { min, max, email, url, pattern }       │  │
│  │  ├─ Number { min, max, integer, positive }         │  │
│  │  ├─ Boolean                                         │  │
│  │  └─ Object { shape: HashMap<String, Schema> }      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Validator                                          │  │
│  │  ├─ validate(schema, value)                        │  │
│  │  ├─ validate_at_path(schema, value, path)          │  │
│  │  └─ validate_with_path() [internal]                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ValidationError                                    │  │
│  │  ├─ path: Vec<String>                              │  │
│  │  ├─ code: String                                   │  │
│  │  └─ message: String                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Validation Flow

```
User Input
    │
    ▼
React Component
    │
    ▼
useWasmForm hook
    │
    ▼
createForm (form runtime)
    │
    ▼
Validator.validateAtPath()
    │
    ▼
WasmValidator.validate_at_path()
    │ (JSON serialization)
    ▼
[WASM Boundary]
    │
    ▼
Rust Validator::validate_at_path()
    │
    ▼
Schema pattern matching & validation
    │
    ▼
ValidationResult (Ok or Err)
    │
    ▼
[WASM Boundary]
    │ (JSON deserialization)
    ▼
TypeScript ValidationResult
    │
    ▼
Form state update
    │
    ▼
React re-render with errors
    │
    ▼
UI displays error message
```

### Schema Definition Flow

```
Developer writes:
  const schema = z.object({
    email: z.string().email()
  });

    │
    ▼
ZObject builder creates schema AST
    │
    ▼
schema.toJSON() serializes to:
  {
    "type": "object",
    "shape": {
      "email": {
        "type": "string",
        "email": true
      }
    }
  }
    │
    ▼
Passed to Validator
    │
    ▼
JSON string sent to WASM
    │
    ▼
Deserialized to Rust Schema enum
    │
    ▼
Used for validation
```

## Component Interactions

```
┌──────────────────────────────────────────────────────────┐
│                      Browser/Node                         │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │              TypeScript Runtime                    │  │
│  │                                                     │  │
│  │  ┌──────────────┐      ┌──────────────┐           │  │
│  │  │    React     │◄────►│     Form     │           │  │
│  │  │   Hooks      │      │   Runtime    │           │  │
│  │  └──────────────┘      └──────┬───────┘           │  │
│  │                               │                    │  │
│  │                               ▼                    │  │
│  │                        ┌──────────────┐            │  │
│  │                        │  Validator   │            │  │
│  │                        │   Wrapper    │            │  │
│  │                        └──────┬───────┘            │  │
│  └───────────────────────────────┼────────────────────┘  │
│                                  │                        │
│                          JSON strings                     │
│                                  │                        │
│  ┌───────────────────────────────▼────────────────────┐  │
│  │               WebAssembly Module                   │  │
│  │                                                     │  │
│  │  ┌──────────────┐      ┌──────────────┐           │  │
│  │  │     WASM     │─────►│     Rust     │           │  │
│  │  │   Bindings   │      │  Validation  │           │  │
│  │  └──────────────┘      └──────────────┘           │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Build Process

```
┌──────────────┐         ┌──────────────┐
│   Rust Code  │         │ TypeScript   │
│   (src/*.rs) │         │ (src/**/*.ts)│
└──────┬───────┘         └──────┬───────┘
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│   rustc +    │         │     tsc      │
│  wasm-pack   │         │              │
└──────┬───────┘         └──────┬───────┘
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│     WASM     │         │   JS + .d.ts │
│   (pkg/)     │         │   (dist/)    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────────┬───────────────┘
                │
                ▼
        ┌──────────────┐
        │   Package    │
        │  (Combined)  │
        └──────────────┘
```

## Error Propagation

```
User Input: "invalid-email"
         │
         ▼
    React Field
         │
         ▼
   onBlur event
         │
         ▼
  form.handleBlur('email')
         │
         ▼
  form.validateField('email')
         │
         ▼
  Validator.validateAtPath(schema, data, ['email'])
         │
         ▼
  WasmValidator.validate_at_path(...)
         │
         ▼
  [WASM] Rust Validator
         │
         ▼
  Email validation fails
         │
         ▼
  ValidationError {
    path: ["email"],
    code: "string.email",
    message: "Invalid email address"
  }
         │
         ▼
  [WASM] JSON serialize
         │
         ▼
  TypeScript receives error
         │
         ▼
  form.errors.email = error
         │
         ▼
  form.subscribe() notifies
         │
         ▼
  React re-renders
         │
         ▼
  Error displayed in UI
```

## Memory Model

```
┌─────────────────────────────────────────────────────────┐
│                   JavaScript Heap                        │
│                                                           │
│  Schema Builder ───► JSON String ───► Validator         │
│       │                                    │             │
│       │                                    │             │
│  Form State ◄───────────────────────────────┘           │
│                                                           │
└───────────────────────┬───────────────────────────────────┘
                        │ (Pass by value)
┌───────────────────────▼───────────────────────────────────┐
│                  WASM Linear Memory                       │
│                                                           │
│  JSON String ───► Parse ───► Schema ───► Validate       │
│                                               │           │
│  ValidationResult ◄───────────────────────────┘           │
│       │                                                   │
│       └───► Serialize ───► JSON String                   │
│                                                           │
└───────────────────────┬───────────────────────────────────┘
                        │ (Return by value)
┌───────────────────────▼───────────────────────────────────┐
│                   JavaScript Heap                        │
│                                                           │
│  ValidationResult ───► Form State Update                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```
