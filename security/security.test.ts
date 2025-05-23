import { startAppForTesting, runZapScan, runNpmAudit } from "./setup"
import { test, expect } from "@jest/globals"

// These tests are meant to be run manually or in a separate CI job
// as they require external tools and can take a long time
test.skip("OWASP ZAP security scan", async () => {
  // Start the app
  const stopApp = await startAppForTesting(3333)

  try {
    // Run ZAP scan
    const reportPath = await runZapScan("http://localhost:3333")
    console.log(`ZAP scan completed. Report saved to: ${reportPath}`)

    // You can add assertions here based on the report content
    // For example, check if there are any high severity issues
    expect(reportPath).toBeTruthy()
  } finally {
    // Stop the app
    await stopApp()
  }
}, 300000) // 5 minute timeout

test("npm audit for dependency vulnerabilities", async () => {
  const reportPath = await runNpmAudit()
  console.log(`npm audit completed. Report saved to: ${reportPath}`)

  // You can add assertions here based on the report content
  expect(reportPath).toBeTruthy()
}, 60000) // 1 minute timeout
