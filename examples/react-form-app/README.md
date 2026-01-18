# React Form App with Rust Validator

A complete React application demonstrating real-world form validation using the Rust-powered WASM validator with external API integration.

## Features

- ✅ **Rust-Powered Validation**: Sub-millisecond validation using WebAssembly
- 🎨 **Modern UI**: Beautiful gradient design with dark mode support
- 🚀 **API Integration**: Posts validated data to external API (JSONPlaceholder)
- 📱 **Responsive**: Works perfectly on mobile and desktop
- 🔍 **Debug Panel**: Real-time form state inspection
- ⚡ **Fast**: Instant field-level validation
- 💪 **Type-Safe**: Full TypeScript support

## Getting Started

### 1. Install Dependencies

```bash
cd examples/react-form-app
npm install
```

The `rustica` package will be installed from npm.

### 2. Run the Development Server

```bash
cd examples/react-form-app
npm run dev
```

The app will open at http://localhost:3000

## What's Included

### Form Fields

- **Name**: String validation (2-50 chars)
- **Email**: Email format validation
- **Username**: Alphanumeric (3-20 chars)
- **Age**: Number validation (18-120, integer only)
- **Website**: URL format validation
- **Bio**: Text area (10-500 chars)
- **Terms Checkbox**: Required acceptance

### Validation Features

- ✓ Real-time validation on change
- ✓ Validation on blur
- ✓ Field-level error messages
- ✓ Form-level validation
- ✓ Submit button state management
- ✓ Success/error notifications

### API Integration

The form posts to: `https://jsonplaceholder.typicode.com/posts`

This is a fake REST API for testing. In production, replace with your actual API endpoint.

## Project Structure

```
react-form-app/
├── src/
│   ├── App.tsx          # Main form component
│   ├── App.css          # Styles
│   ├── main.tsx         # Entry point with WASM init
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## How It Works

1. **Auto-Initialization**: WASM loads automatically on first validation - no manual setup needed!
2. **Schema Definition**: Form validation rules are defined using the `r` schema builder
3. **React Hook**: `useWasmForm` manages form state and validation
4. **Real-time Validation**: Fields are validated as you type using Rust
5. **API Submission**: Valid data is posted to external API
6. **Response Handling**: Success/error states are displayed to user

## Key Code Example

```typescript
// Define schema with Rust validator
const userSchema = r.object({
  email: r.string().email(),
  age: r.number().min(18).integer(),
});

// Use in React component
const form = useWasmForm({
  schema: userSchema,
  onSubmit: async (data) => {
    // Post to API
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Handle response
  },
});
```

## Customization

### Change API Endpoint

Edit `src/App.tsx`:

```typescript
const API_URL = "https://your-api.com/endpoint";
```

### Modify Validation Rules

Update the schema in `src/App.tsx`:

```typescript
const userSchema = r.object({
  // Add or modify fields
  phone: r.string().min(10).max(15),
});
```

### Style Changes

Edit `src/App.css` to customize colors, spacing, and layout.

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Performance

- **WASM Load**: ~5ms
- **Validation**: <1ms per field
- **Bundle Size**: ~150KB (including WASM)

## Browser Support

- Chrome/Edge 87+
- Firefox 89+
- Safari 15+
- Modern mobile browsers

## Troubleshooting

### WASM Not Loading

Make sure the parent package is built:

```bash
cd ../..
make build
```

### Type Errors

Rebuild TypeScript:

```bash
npm run build
```

### API Errors

Check browser console for CORS or network issues. JSONPlaceholder should work without authentication.

## Learn More

- [Rust-JS Validator Docs](../../docs/GETTING_STARTED.md)
- [API Reference](../../docs/API.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## License

Same as parent project
