import { createRoot } from "react-dom/client";
import { App } from "./App";
import { store, SubstateProvider } from "./store";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <SubstateProvider store={store}>
    <App />
  </SubstateProvider>,
);

