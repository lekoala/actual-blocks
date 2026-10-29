import { defineConfig, devices } from "@playwright/test";
import { PORT, SUBPATH_PORT } from "./scripts/ports.js";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: [
    {
      command: "bun scripts/serve.js",
      port: PORT,
      env: { PORT: String(PORT) },
      reuseExistingServer: true,
      timeout: 30_000
    },
    {
      command: "bun scripts/serve-subpath.js",
      port: SUBPATH_PORT,
      env: { SUBPATH_PORT: String(SUBPATH_PORT) },
      reuseExistingServer: true,
      timeout: 30_000
    }
  ],
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read", "clipboard-write"]
      }
    }
  ]
});
