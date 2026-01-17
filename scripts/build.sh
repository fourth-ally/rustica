#!/bin/bash

# Build script for CI/CD environments

set -e  # Exit on error

echo "=== Rust-JS Validator Build Script ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found"
    echo "Install from: https://rustup.rs"
    exit 1
fi
echo "✓ Rust $(rustc --version)"

# Check wasm-pack
if ! command -v wasm-pack &> /dev/null; then
    echo "⚠️  wasm-pack not found, installing..."
    cargo install wasm-pack
fi
echo "✓ wasm-pack $(wasm-pack --version)"

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Build WASM
echo ""
echo "Building Rust to WebAssembly..."
wasm-pack build --target web --out-dir pkg

# Build TypeScript
echo ""
echo "Building TypeScript..."
npx tsc

# Run tests
echo ""
echo "Running tests..."
cargo test --quiet
echo "✓ Rust tests passed"

# Check sizes
echo ""
echo "Build artifact sizes:"
du -sh pkg/ dist/ 2>/dev/null || true

echo ""
echo "=== Build Complete ==="
echo ""
echo "Output:"
echo "  - WASM:       pkg/"
echo "  - TypeScript: dist/"
echo ""
echo "Next steps:"
echo "  - Run example: node --loader tsx examples/quick-test.ts"
echo "  - Start dev:   npm run dev"
