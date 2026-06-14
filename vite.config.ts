import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    environments: {
      ssr: {
        nitro: { preset: "netlify-edge" },
      },
    },
  },
});