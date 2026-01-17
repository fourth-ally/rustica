import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initWasm } from "rustica";
import App from "./App";
import "./index.css";

function Root() {
  const [wasmReady, setWasmReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initWasm()
      .then(() => setWasmReady(true))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Error loading WASM</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!wasmReady) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Loading validator...</h1>
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
