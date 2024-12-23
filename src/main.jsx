import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Importing the CSS file for global styles

// Main entry point for the app
const rootElement = document.getElementById("root");

// Rendering the App component inside the root div
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
