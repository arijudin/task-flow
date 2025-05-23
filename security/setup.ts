import { spawn } from "child_process"
import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { join } from "path"
import fs from "fs"

// Function to start the Next.js app for security testing
export async function startAppForTesting(port = 3000): Promise<() => Promise<void>> {
  const app = next({ dev: true })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(`> App started on port ${port}`)

  // Return a function to close the server
  return async () => {
    return new Promise((resolve) => {
      server.close(() => {
        console.log("> App stopped")
        resolve()
      })
    })
  }
}

// Function to run OWASP ZAP security scan
export async function runZapScan(target: string): Promise<string> {
  const reportPath = join(process.cwd(), "security-reports", "zap-report.html")

  // Ensure the reports directory exists
  if (!fs.existsSync(join(process.cwd(), "security-reports"))) {
    fs.mkdirSync(join(process.cwd(), "security-reports"), { recursive: true })
  }

  return new Promise((resolve, reject) => {
    // This assumes ZAP is installed and available in PATH
    // For CI environments, you would use a Docker container
    const zap = spawn("zap-cli", [
      "quick-scan",
      "--self-contained",
      "--start-options",
      "-config api.disablekey=true",
      "-r",
      reportPath,
      target,
    ])

    zap.stdout.on("data", (data) => {
      console.log(`ZAP: ${data}`)
    })

    zap.stderr.on("data", (data) => {
      console.error(`ZAP Error: ${data}`)
    })

    zap.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ZAP scan failed with code ${code}`))
      } else {
        resolve(reportPath)
      }
    })
  })
}

// Function to run npm audit
export async function runNpmAudit(): Promise<string> {
  const reportPath = join(process.cwd(), "security-reports", "npm-audit.json")

  // Ensure the reports directory exists
  if (!fs.existsSync(join(process.cwd(), "security-reports"))) {
    fs.mkdirSync(join(process.cwd(), "security-reports"), { recursive: true })
  }

  return new Promise((resolve, reject) => {
    const audit = spawn("npm", ["audit", "--json"])
    let output = ""

    audit.stdout.on("data", (data) => {
      output += data
    })

    audit.stderr.on("data", (data) => {
      console.error(`npm audit Error: ${data}`)
    })

    audit.on("close", (code) => {
      fs.writeFileSync(reportPath, output)
      resolve(reportPath)
    })
  })
}
