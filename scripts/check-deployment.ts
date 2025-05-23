#!/usr/bin/env tsx

/**
 * TaskFlow Deployment Health Check Script
 * Verifies that the deployment is working correctly
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface HealthCheckResult {
  endpoint: string
  status: "success" | "error"
  message: string
  responseTime?: number
}

class DeploymentChecker {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
  }

  async checkEndpoint(path: string): Promise<HealthCheckResult> {
    const url = `${this.baseUrl}${path}`
    const startTime = Date.now()

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "TaskFlow-Health-Check/1.0",
        },
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        return {
          endpoint: path,
          status: "success",
          message: `✅ ${response.status} ${response.statusText}`,
          responseTime,
        }
      } else {
        return {
          endpoint: path,
          status: "error",
          message: `❌ ${response.status} ${response.statusText}`,
          responseTime,
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        endpoint: path,
        status: "error",
        message: `❌ ${error instanceof Error ? error.message : "Unknown error"}`,
        responseTime,
      }
    }
  }

  async checkDatabase(): Promise<HealthCheckResult> {
    try {
      const { stdout, stderr } = await execAsync('npx prisma db execute --stdin <<< "SELECT 1"')

      if (stderr) {
        return {
          endpoint: "database",
          status: "error",
          message: `❌ Database connection failed: ${stderr}`,
        }
      }

      return {
        endpoint: "database",
        status: "success",
        message: "✅ Database connection successful",
      }
    } catch (error) {
      return {
        endpoint: "database",
        status: "error",
        message: `❌ Database check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  async runAllChecks(): Promise<void> {
    console.log("🔍 Running TaskFlow Deployment Health Checks")
    console.log("=".repeat(50))
    console.log(`🌐 Base URL: ${this.baseUrl}`)
    console.log("")

    const endpoints = ["/", "/api/health", "/login", "/signup", "/dashboard"]

    const results: HealthCheckResult[] = []

    // Check web endpoints
    console.log("📡 Checking Web Endpoints:")
    for (const endpoint of endpoints) {
      const result = await this.checkEndpoint(endpoint)
      results.push(result)

      const responseTimeStr = result.responseTime ? ` (${result.responseTime}ms)` : ""
      console.log(`  ${result.message}${responseTimeStr} - ${endpoint}`)
    }

    console.log("")

    // Check database
    console.log("🗄️  Checking Database Connection:")
    const dbResult = await this.checkDatabase()
    results.push(dbResult)
    console.log(`  ${dbResult.message}`)

    console.log("")

    // Summary
    const successCount = results.filter((r) => r.status === "success").length
    const totalCount = results.length
    const successRate = (successCount / totalCount) * 100

    console.log("📊 Health Check Summary:")
    console.log(`  ✅ Successful: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`)

    if (successRate === 100) {
      console.log("  🎉 All checks passed! Deployment is healthy.")
    } else {
      console.log("  ⚠️  Some checks failed. Please review the issues above.")
    }

    // Performance summary
    const webResults = results.filter((r) => r.responseTime !== undefined)
    if (webResults.length > 0) {
      const avgResponseTime = webResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / webResults.length
      console.log(`  ⚡ Average response time: ${avgResponseTime.toFixed(0)}ms`)
    }

    console.log("")

    // Exit with error code if any checks failed
    if (successRate < 100) {
      process.exit(1)
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error("❌ Please provide the deployment URL")
    console.error("Usage: npm run check:deployment <URL>")
    console.error("Example: npm run check:deployment https://taskflow.vercel.app")
    process.exit(1)
  }

  const deploymentUrl = args[0]

  if (!deploymentUrl.startsWith("http")) {
    console.error("❌ Please provide a valid URL starting with http:// or https://")
    process.exit(1)
  }

  const checker = new DeploymentChecker(deploymentUrl)
  await checker.runAllChecks()
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Health check failed:", error)
    process.exit(1)
  })
}

export { DeploymentChecker }
