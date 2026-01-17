#!/bin/bash

# Development setup script

set -e

echo "=== Rust-JS Validator Development Setup ==="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required"
    echo "   Install from: https://nodejs.org"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is required"
    echo "   Install from: https://rustup.rs"
    echo "   Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi
echo "✓ Rust $(rustc --version)"

# Add wasm32 target
echo ""
echo "Adding wasm32 target..."
rustup target add wasm32-unknown-unknown

# Install wasm-pack
echo ""
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    cargo install wasm-pack
else
    echo "✓ wasm-pack $(wasm-pack --version)"
fi

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Initial build
echo ""
echo "Running initial build..."
npm run build:wasm
npm run build:ts

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Available commands:"
echo "  npm run build       - Build everything"
echo "  npm run dev         - Start development mode"
echo "  npm test            - Run tests"
echo "  make help           - Show all make commands"
echo ""
echo "Try the example:"
echo "  node --loader tsx examples/quick-test.ts"
