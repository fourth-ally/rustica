import React from "react";
import { r, useWasmForm, initWasm, type Infer } from "../src/index";

// Initialize WASM before using forms
await initWasm();

/**
 * Example: Login form schema with validation
 */
const loginSchema = r.object({
  email: r.string().min(3).email().ui({
    label: "Email Address",
    placeholder: "you@example.com",
  }),
  password: r.string().min(8).ui({
    label: "Password",
    placeholder: "Min 8 characters",
  }),
  remember: r.boolean().ui({ label: "Remember me" }),
});

// Type inference
type LoginForm = Infer<typeof loginSchema>;

/**
 * Login form component using useWasmForm hook
 */
export function LoginFormExample() {
  const form = useWasmForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    onSubmit: async (data: LoginForm) => {
      console.log("Form submitted with valid data:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Login successful!");
    },
    validateOnBlur: true,
  });

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Login Form Example</h2>

      <form
        onSubmit={form.handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Email field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="email" style={{ fontWeight: "bold" }}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
            style={{
              padding: "8px",
              border: form.errors.email ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.email && form.errors.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.email.message}
            </span>
          )}
        </div>

        {/* Password field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="password" style={{ fontWeight: "bold" }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Min 8 characters"
            {...form.register("password")}
            style={{
              padding: "8px",
              border: form.errors.password ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.password && form.errors.password && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.password.message}
            </span>
          )}
        </div>

        {/* Remember me checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input id="remember" type="checkbox" {...form.register("remember")} />
          <label htmlFor="remember">Remember me</label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={form.isSubmitting}
          style={{
            padding: "12px",
            backgroundColor: form.isSubmitting ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: form.isSubmitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {form.isSubmitting ? "Submitting..." : "Login"}
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={form.reset}
          style={{
            padding: "12px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </form>

      {/* Debug info */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Debug Info</h3>
        <pre style={{ fontSize: "12px", overflow: "auto" }}>
          {JSON.stringify(
            {
              values: form.values,
              errors: form.errors,
              touched: form.touched,
              isValid: form.isValid,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}

/**
 * Example: Registration form with more complex validation
 */
const registrationSchema = r.object({
  username: r.string().min(3).max(20).ui({ label: "Username" }),
  email: r.string().min(3).email().ui({ label: "Email" }),
  age: r.number().min(18).max(120).integer().ui({ label: "Age" }),
  website: r
    .string()
    .url()
    .ui({ label: "Website", placeholder: "https://example.com" }),
  agree: r.boolean().ui({ label: "I agree to terms and conditions" }),
});

type RegistrationForm = Infer<typeof registrationSchema>;

export function RegistrationFormExample() {
  const form = useWasmForm({
    schema: registrationSchema,
    defaultValues: {
      username: "",
      email: "",
      age: 18,
      website: "",
      agree: false,
    },
    onSubmit: async (data: RegistrationForm) => {
      console.log("Registration data:", data);
      alert("Registration successful!");
    },
  });

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Registration Form Example</h2>

      <form
        onSubmit={form.handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="username" style={{ fontWeight: "bold" }}>
            Username
          </label>
          <input
            id="username"
            {...form.register("username")}
            style={{
              padding: "8px",
              border: form.errors.username ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.username && form.errors.username && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.username.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="email" style={{ fontWeight: "bold" }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            style={{
              padding: "8px",
              border: form.errors.email ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.email && form.errors.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.email.message}
            </span>
          )}
        </div>

        {/* Age */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="age" style={{ fontWeight: "bold" }}>
            Age
          </label>
          <input
            id="age"
            type="number"
            {...form.register("age")}
            style={{
              padding: "8px",
              border: form.errors.age ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.age && form.errors.age && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.age.message}
            </span>
          )}
        </div>

        {/* Website */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label htmlFor="website" style={{ fontWeight: "bold" }}>
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://example.com"
            {...form.register("website")}
            style={{
              padding: "8px",
              border: form.errors.website ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {form.touched.website && form.errors.website && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {form.errors.website.message}
            </span>
          )}
        </div>

        {/* Terms agreement */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input id="agree" type="checkbox" {...form.register("agree")} />
          <label htmlFor="agree">I agree to terms and conditions</label>
        </div>

        <button
          type="submit"
          disabled={form.isSubmitting || !form.values.agree}
          style={{
            padding: "12px",
            backgroundColor:
              form.isSubmitting || !form.values.agree ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              form.isSubmitting || !form.values.agree
                ? "not-allowed"
                : "pointer",
            fontWeight: "bold",
          }}
        >
          {form.isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
