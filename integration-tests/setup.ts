import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Setup function to create test data
export async function setupTestData() {
  // Create test user
  const hashedPassword = await bcrypt.hash("testpassword", 10)
  const user = await prisma.user.create({
    data: {
      name: "Integration Test User",
      email: "integration-test@example.com",
      password: hashedPassword,
    },
  })

  // Create test project
  const project = await prisma.project.create({
    data: {
      name: "Integration Test Project",
      description: "Project for integration testing",
      status: "active",
      userId: user.id,
    },
  })

  // Create test tasks
  const todoTask = await prisma.task.create({
    data: {
      title: "Todo Integration Task",
      description: "Task for integration testing - todo",
      status: "todo",
      priority: "medium",
      projectId: project.id,
      assigneeId: user.id,
    },
  })

  const inProgressTask = await prisma.task.create({
    data: {
      title: "In Progress Integration Task",
      description: "Task for integration testing - in progress",
      status: "in-progress",
      priority: "high",
      projectId: project.id,
      assigneeId: user.id,
    },
  })

  const completedTask = await prisma.task.create({
    data: {
      title: "Completed Integration Task",
      description: "Task for integration testing - completed",
      status: "completed",
      priority: "low",
      projectId: project.id,
      assigneeId: user.id,
    },
  })

  return {
    user,
    project,
    tasks: {
      todoTask,
      inProgressTask,
      completedTask,
    },
  }
}

// Cleanup function to remove test data
export async function cleanupTestData() {
  // Delete all tasks
  await prisma.task.deleteMany({
    where: {
      project: {
        user: {
          email: "integration-test@example.com",
        },
      },
    },
  })

  // Delete all projects
  await prisma.project.deleteMany({
    where: {
      user: {
        email: "integration-test@example.com",
      },
    },
  })

  // Delete test user
  await prisma.user.deleteMany({
    where: {
      email: "integration-test@example.com",
    },
  })
}
