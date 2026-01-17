import { useState } from "react";
import { r, useWasmForm, type Infer } from "rustica";
import "./App.css";

// Define API endpoint (using JSONPlaceholder for demo)
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Define user registration schema
const userSchema = r.object({
  name: r.string().min(2).max(50),
  email: r.string().email(),
  username: r.string().min(3).max(20),
  age: r.number().min(18).max(120).integer(),
  website: r.string().url(),
  bio: r.string().min(10).max(500),
  agreedToTerms: r.boolean(),
});

type UserForm = Infer<typeof userSchema>;

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function App() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useWasmForm({
    schema: userSchema,
    defaultValues: {
      name: "",
      email: "",
      username: "",
      age: 18,
      website: "",
      bio: "",
      agreedToTerms: false,
    },
    onSubmit: async (data: UserForm) => {
      console.log("Submitting form data:", data);

      try {
        // Post to external API
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        setApiResponse({ success: true, data: result });
        setShowSuccess(true);

        // Reset form after successful submission
        setTimeout(() => {
          form.reset();
          setShowSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("API Error:", error);
        setApiResponse({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🦀 Rust-Powered Form Validation</h1>
          <p>WebAssembly-based validation with React</p>
        </header>

        {showSuccess && (
          <div className="success-banner">
            ✅ Form submitted successfully! Check console for API response.
          </div>
        )}

        {apiResponse?.error && (
          <div className="error-banner">❌ Error: {apiResponse.error}</div>
        )}

        <form onSubmit={form.handleSubmit} className="form">
          {/* Name Field */}
          <div className="form-field">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...form.register("name")}
              className={form.errors.name ? "error" : ""}
            />
            {form.touched.name && form.errors.name && (
              <span className="error-message">{form.errors.name.message}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
              className={form.errors.email ? "error" : ""}
            />
            {form.touched.email && form.errors.email && (
              <span className="error-message">{form.errors.email.message}</span>
            )}
          </div>

          {/* Username Field */}
          <div className="form-field">
            <label htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              {...form.register("username")}
              className={form.errors.username ? "error" : ""}
            />
            {form.touched.username && form.errors.username && (
              <span className="error-message">
                {form.errors.username.message}
              </span>
            )}
          </div>

          {/* Age Field */}
          <div className="form-field">
            <label htmlFor="age">
              Age <span className="required">*</span>
            </label>
            <input
              id="age"
              type="number"
              placeholder="18"
              {...form.register("age")}
              className={form.errors.age ? "error" : ""}
            />
            {form.touched.age && form.errors.age && (
              <span className="error-message">{form.errors.age.message}</span>
            )}
          </div>

          {/* Website Field */}
          <div className="form-field">
            <label htmlFor="website">
              Website <span className="required">*</span>
            </label>
            <input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...form.register("website")}
              className={form.errors.website ? "error" : ""}
            />
            {form.touched.website && form.errors.website && (
              <span className="error-message">
                {form.errors.website.message}
              </span>
            )}
          </div>

          {/* Bio Field */}
          <div className="form-field">
            <label htmlFor="bio">
              Bio <span className="required">*</span>
            </label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself (min 10 characters)..."
              {...form.register("bio")}
              className={form.errors.bio ? "error" : ""}
              rows={4}
            />
            {form.touched.bio && form.errors.bio && (
              <span className="error-message">{form.errors.bio.message}</span>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="form-field checkbox">
            <label>
              <input type="checkbox" {...form.register("agreedToTerms")} />
              <span>
                I agree to the terms and conditions{" "}
                <span className="required">*</span>
              </span>
            </label>
            {form.touched.agreedToTerms && form.errors.agreedToTerms && (
              <span className="error-message">
                {form.errors.agreedToTerms.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={form.isSubmitting || !((form.values as any).agreedToTerms)}
              className="btn-primary"
            >
              {form.isSubmitting ? "⏳ Submitting..." : "🚀 Submit to API"}
            </button>

            <button
              type="button"
              onClick={form.reset}
              className="btn-secondary"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Debug Panel */}
        <details className="debug-panel">
          <summary>🔍 Debug Info (Form State)</summary>
          <div className="debug-content">
            <div className="debug-section">
              <h3>Values</h3>
              <pre>{JSON.stringify(form.values, null, 2)}</pre>
            </div>
            <div className="debug-section">
              <h3>Errors</h3>
              <pre>{JSON.stringify(form.errors, null, 2)}</pre>
            </div>
            <div className="debug-section">
              <h3>Touched</h3>
              <pre>{JSON.stringify(form.touched, null, 2)}</pre>
            </div>
            <div className="debug-section">
              <h3>Status</h3>
              <pre>
                {JSON.stringify(
                  {
                    isValid: form.isValid,
                    isSubmitting: form.isSubmitting,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </details>

        {/* API Response Panel */}
        {apiResponse?.data && (
          <details className="api-panel" open>
            <summary>📡 API Response</summary>
            <div className="debug-content">
              <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
            </div>
          </details>
        )}

        <footer>
          <p>
            <strong>Powered by:</strong> Rust + WebAssembly + React
          </p>
          <p className="small">
            This form uses Rust for validation (compiled to WASM) and posts data
            to JSONPlaceholder API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
