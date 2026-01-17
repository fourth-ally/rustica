# Documentation Index

Welcome to the rustica documentation! This is a complete guide to using the library.

## 📚 Getting Started

Start here if you're new to rustica:

1. **[Getting Started Guide](./GETTING_STARTED.md)**
   - Installation instructions
   - Quick start examples
   - React integration
   - Non-React usage
   - Common patterns
   - Testing strategies

## 📖 Core Documentation

### API Reference

- **[Complete API Reference](./API.md)**
  - Schema builders (`z.string()`, `z.number()`, etc.)
  - Validator methods
  - Form runtime API
  - React hooks
  - Type utilities
  - Error structures

### Architecture

- **[Architecture Documentation](./ARCHITECTURE.md)**
  - System design
  - Design decisions
  - File structure
  - Performance characteristics
  - Extension points
  - Testing strategy
  - Security considerations

### Diagrams

- **[System Diagrams](./DIAGRAMS.md)**
  - High-level architecture
  - Data flow diagrams
  - Component interactions
  - Build process
  - Error propagation
  - Memory model

## 🔍 Comparisons

- **[Feature Matrix & Comparison](./COMPARISON.md)**
  - vs Zod, Yup, Joi, Valibot
  - Performance benchmarks
  - Bundle size comparison
  - Feature comparison table
  - Use case recommendations
  - Migration guides
  - Roadmap

## 💻 Examples

Located in the `examples/` directory:

1. **[Quick Test](../examples/quick-test.ts)**
   - Simple validation examples
   - Quick verification that everything works
   - Run with: `node --loader tsx examples/quick-test.ts`

2. **[Standalone Usage](../examples/standalone.ts)**
   - Non-React validation examples
   - String, number, boolean, object validation
   - Field-level validation
   - Error handling
   - Performance testing

3. **[React Forms](../examples/forms.tsx)**
   - Login form example
   - Registration form example
   - Error display
   - Field registration
   - Submit handling
   - Form reset

## 🛠️ Development

### Contributing

- **[Contributing Guide](../CONTRIBUTING.md)**
  - Development setup
  - Code style guidelines
  - Testing requirements
  - Pull request process
  - Adding new features
  - Release process

### Changelog

- **[Changelog](../CHANGELOG.md)**
  - Version history
  - Breaking changes
  - New features
  - Bug fixes
  - Migration notes

## 📦 Project Files

### Configuration

- `Cargo.toml` - Rust dependencies and build configuration
- `package.json` - NPM package configuration
- `tsconfig.json` - TypeScript compiler options
- `Makefile` - Build commands and shortcuts

### Build Scripts

- `scripts/build.sh` - CI/CD build script
- `scripts/setup.sh` - Development environment setup

### Project Info

- `README.md` - Project overview
- `LICENSE` - MIT license
- `PROJECT_SUMMARY.md` - Comprehensive project summary

## 🎯 Quick Links by Use Case

### "I want to validate a form in React"

→ [Getting Started](./GETTING_STARTED.md#react-integration) → [React Forms Example](../examples/forms.tsx)

### "I want to validate data without React"

→ [Standalone Usage Example](../examples/standalone.ts) → [Validator API](./API.md#validator)

### "I want to understand how it works"

→ [Architecture](./ARCHITECTURE.md) → [Diagrams](./DIAGRAMS.md)

### "I want to compare with other libraries"

→ [Feature Comparison](./COMPARISON.md)

### "I want to contribute"

→ [Contributing Guide](../CONTRIBUTING.md)

### "I want to migrate from Zod/Yup"

→ [Migration Guide](./COMPARISON.md#migration-guide)

## 📚 Learning Path

### Beginner

1. Read [Getting Started](./GETTING_STARTED.md)
2. Run [Quick Test](../examples/quick-test.ts)
3. Try [Standalone Example](../examples/standalone.ts)
4. Browse [API Reference](./API.md)

### Intermediate

1. Study [React Forms Example](../examples/forms.tsx)
2. Read [Architecture](./ARCHITECTURE.md)
3. Explore [API Reference](./API.md) in depth
4. Review [Feature Comparison](./COMPARISON.md)

### Advanced

1. Study [System Diagrams](./DIAGRAMS.md)
2. Read [Contributing Guide](../CONTRIBUTING.md)
3. Review Rust source code
4. Plan custom extensions

## 🔗 External Resources

### Rust & WebAssembly

- [Rust Book](https://doc.rust-lang.org/book/)
- [WebAssembly Docs](https://webassembly.org/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [Rust WASM Book](https://rustwasm.github.io/docs/book/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### React

- [React Documentation](https://react.dev/)
- [React Hook Form](https://react-hook-form.com/) (similar API)

### Validation Libraries

- [Zod](https://zod.dev/)
- [Yup](https://github.com/jquense/yup)
- [Joi](https://joi.dev/)
- [Valibot](https://valibot.dev/)

## 📞 Support

### Bug Reports

Open an issue on GitHub with:

- Description of the problem
- Minimal reproduction example
- Expected vs actual behavior
- Environment details (Node version, browser, etc.)

### Feature Requests

Open an issue on GitHub with:

- Clear description of the feature
- Use case explanation
- Example API (if applicable)
- Willingness to contribute

### Questions

- Check documentation first
- Search existing issues
- Open a discussion on GitHub

### Security Issues

Report security vulnerabilities privately via GitHub Security Advisory.

## 🗺️ Documentation Structure

```
docs/
├── INDEX.md              ← You are here
├── GETTING_STARTED.md    ← Start here
├── API.md                ← Complete API reference
├── ARCHITECTURE.md       ← How it works
├── DIAGRAMS.md          ← Visual diagrams
└── COMPARISON.md        ← vs other libraries

../
├── README.md            ← Project overview
├── CONTRIBUTING.md      ← How to contribute
├── CHANGELOG.md         ← Version history
├── PROJECT_SUMMARY.md   ← Complete summary
├── examples/
│   ├── quick-test.ts    ← Quick verification
│   ├── standalone.ts    ← Validation examples
│   └── forms.tsx        ← React form examples
└── tests/
    └── validator.test.ts ← Test suite
```

## 📝 Documentation Standards

All documentation follows these principles:

1. **Clear Examples** - Every feature has working code examples
2. **Progressive Disclosure** - Start simple, get more advanced
3. **Cross-References** - Link to related topics
4. **Up-to-Date** - Docs updated with every release
5. **Searchable** - Use consistent terminology
6. **Accessible** - Clear language, good structure

## 🎨 Conventions

### Code Blocks

- TypeScript examples use `typescript` syntax highlighting
- Rust examples use `rust` syntax highlighting
- Shell commands use `bash` syntax highlighting

### Terminology

- **Schema** - Definition of validation rules
- **Validator** - The validation engine
- **Form** - Form state management instance
- **Field** - Individual form field
- **Path** - Array of strings to locate nested fields

### Symbols

- ✅ Supported/Recommended
- 🚧 In Progress/Planned
- ⚠️ Warning/Caution
- ❌ Not Supported
- 💡 Tip/Note
- 🔍 Deep Dive

## 🔄 Keeping Up to Date

- **Watch** the GitHub repository for updates
- Check [CHANGELOG.md](../CHANGELOG.md) for new versions
- Review closed issues for recent fixes
- Follow release notes for breaking changes

## 📄 License

All documentation is licensed under [MIT License](../LICENSE), same as the code.

---

**Happy Validating! 🎉**

If you have suggestions for improving this documentation, please open an issue or pull request.
