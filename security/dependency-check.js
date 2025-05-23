const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

// Path to save the report
const reportPath = path.join(process.cwd(), "security-reports", "dependency-check.html")

// Ensure the reports directory exists
if (!fs.existsSync(path.join(process.cwd(), "security-reports"))) {
  fs.mkdirSync(path.join(process.cwd(), "security-reports"), { recursive: true })
}

// Run dependency-check
// This assumes dependency-check is installed
// For CI environments, you would use a Docker container
const dependencyCheck = spawn("dependency-check", [
  "--project",
  "TaskFlow",
  "--scan",
  ".",
  "--exclude",
  "node_modules",
  "--exclude",
  ".next",
  "--out",
  reportPath,
  "--format",
  "HTML",
])

dependencyCheck.stdout.on("data", (data) => {
  console.log(`dependency-check: ${data}`)
})

dependencyCheck.stderr.on("data", (data) => {
  console.error(`dependency-check Error: ${data}`)
})

dependencyCheck.on("close", (code) => {
  if (code !== 0) {
    console.error(`dependency-check failed with code ${code}`)
    process.exit(code)
  } else {
    console.log(`dependency-check completed. Report saved to: ${reportPath}`)
  }
})
