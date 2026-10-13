import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ base: "/sales-quoting-cpq/", build: { sourcemap: false }, plugins: [react()] });
