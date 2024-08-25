import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Container from "./components/Container.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Container />
  </StrictMode>
);
