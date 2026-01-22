import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StudioApp from "./studio/StudioApp.jsx";
import StateManage from "./StateManage.jsx";

const pathname = window.location.pathname;
const isStateManage = pathname === "/state-manage" || pathname.startsWith("/state-manage/");
const hostname = window.location.hostname;
const isStudioHost = hostname.startsWith("studio.");
const isStudioPath = pathname === "/studio" || pathname.startsWith("/studio/");
const Root = isStateManage
  ? StateManage
  : isStudioHost || isStudioPath
    ? StudioApp
    : App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
