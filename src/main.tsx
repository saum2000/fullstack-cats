import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Container from "./components/Container";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Container />
  </StrictMode>
);
