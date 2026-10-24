import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "");
  const repositoryName = env.GITHUB_REPOSITORY?.split("/").pop() ?? "";
  const automaticPagesBase =
    !repositoryName || repositoryName.toLowerCase().endsWith(".github.io")
      ? "/"
      : `/${repositoryName}/`;
  const pagesBase = env.GITHUB_PAGES_BASE || automaticPagesBase;

  return {
    base: command === "build" ? pagesBase : "/",
    build: {
      outDir: "dist/client",
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
    plugins: [react()],
  };
});
