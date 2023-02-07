import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const AppContainer = document.getElementById("app");
if (AppContainer === null) {
  throw new Error("Can't find the root node #app");
}

const root = createRoot(AppContainer);

root.render(<App />);
