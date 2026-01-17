.PHONY: help install build build-wasm build-ts clean test lint format dev watch-ts watch-wasm example

# Default target
help:
	@echo "Rust-JS Validator - Build Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install      Install dependencies"
	@echo ""
	@echo "Build:"
	@echo "  make build        Build WASM and TypeScript"
	@echo "  make build-wasm   Build Rust to WASM"
	@echo "  make build-ts     Build TypeScript"
	@echo ""
	@echo "Development:"
	@echo "  make dev          Watch mode for TypeScript"
	@echo "  make watch-ts     Watch TypeScript only"
	@echo "  make watch-wasm   Watch Rust only"
	@echo ""
	@echo "Testing:"
	@echo "  make test         Run all tests"
	@echo "  make test-rust    Run Rust tests"
	@echo "  make example      Run example validation"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        Remove build artifacts"
	@echo "  make format       Format code"
	@echo "  make lint         Lint code"

install:
	@echo "Installing dependencies..."
	npm install
	@echo "Checking for Rust..."
	@rustc --version || (echo "Rust not found. Install from https://rustup.rs" && exit 1)
	@echo "Checking for wasm-pack..."
	@wasm-pack --version || cargo install wasm-pack

build: build-wasm build-ts
	@echo "Build complete!"

build-wasm:
	@echo "Building Rust to WASM..."
	wasm-pack build --target bundler --out-dir pkg

build-ts:
	@echo "Building TypeScript..."
	npx tsc

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/ pkg/ target/ node_modules/.cache
	cargo clean

test: build
	@echo "Running Rust tests..."
	cargo test
	@echo "Running TypeScript tests..."
	npm run test:ts

test-rust:
	@echo "Running Rust tests..."
	cargo test

example: build
	@echo "Running validation example..."
	node --import tsx examples/quick-test.ts

dev: build
	@echo "Starting development mode..."
	npm run dev

watch-ts:
	@echo "Watching TypeScript..."
	npx tsc --watch

watch-wasm:
	@echo "Watching Rust (manual rebuild on save)..."
	cargo watch -x "build --target wasm32-unknown-unknown"

format:
	@echo "Formatting code..."
	cargo fmt
	npx prettier --write "src/**/*.ts" "examples/**/*.ts"

lint:
	@echo "Linting code..."
	cargo clippy -- -D warnings
	npx eslint "src/**/*.ts"

# Release build (optimized)
release:
	@echo "Building release version..."
	wasm-pack build --target web --out-dir pkg --release
	npx tsc
	@echo "Release build complete!"

# Show sizes
size: build
	@echo "Build artifact sizes:"
	@du -sh pkg/
	@du -sh dist/
	@du -sh pkg/*.wasm
