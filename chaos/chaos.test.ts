import { createChaosProxy, cleanupChaosTest } from "./setup"
import { test } from "@jest/globals"

// Get the chaos proxy
const chaosPrisma = createChaosProxy()

// These tests are meant to be run manually or in a separate CI job
// as they can potentially affect the database
test.skip("Chaos testing for user operations", async () => {
  try {
    // Try to create a user with the chaos proxy
    const user = await chaosPrisma.user.create({
      data: {
        name: "Chaos Test User",
        email: `chaos-test-${Date.now()}@example.com`,
        password: "chaospassword",
      },
    })

    console.log("User created:", user)

    // Try to find the user
    const foundUser = await chaosPrisma.user.findUnique({
      where: { id: user.id },
    })

    console.log("User found:", foundUser)

    // Clean up
    await chaosPrisma.user.delete({
      where: { id: user.id },
    })

    console.log("User deleted")
  } catch (error) {
    console.error("Chaos test error:", error)
    // We expect some operations to fail, so this is not necessarily a test failure
  } finally {
    await cleanupChaosTest()
  }
}, 30000) // 30 second timeout

test.skip("Chaos testing for project operations", async () => {
  try {
    // Create a user first
    const user = await chaosPrisma.user.create({
      data: {
        name: "Chaos Project User",
        email: `chaos-project-${Date.now()}@example.com`,
        password: "chaospassword",
      },
    })

    console.log("User created:", user)

    // Try to create a project with the chaos proxy
    const project = await chaosPrisma.project.create({
      data: {
        name: "Chaos Test Project",
        description: "Project for chaos testing",
        status: "active",
        userId: user.id,
      },
    })

    console.log("Project created:", project)

    // Try to find the project
    const foundProject = await chaosPrisma.project.findUnique({
      where: { id: project.id },
    })

    console.log("Project found:", foundProject)

    // Clean up
    await chaosPrisma.project.delete({
      where: { id: project.id },
    })

    console.log("Project deleted")

    await chaosPrisma.user.delete({
      where: { id: user.id },
    })

    console.log("User deleted")
  } catch (error) {
    console.error("Chaos test error:", error)
    // We expect some operations to fail, so this is not necessarily a test failure
  } finally {
    await cleanupChaosTest()
  }
}, 30000) // 30 second timeout
