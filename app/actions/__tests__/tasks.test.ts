import { createTask, updateTaskStatus } from "../tasks"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "../auth"
import jest from "jest" // Declare the jest variable

// Mock getCurrentUser
jest.mock("../auth", () => ({
  getCurrentUser: jest.fn(),
}))

// Mock prisma
jest.mock("@/lib/prisma")

// Mock revalidatePath
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

describe("Task Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createTask", () => {
    it("should create a new task and return success", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock form data
      const formData = new FormData()
      formData.append("title", "Test Task")
      formData.append("description", "This is a test task")
      formData.append("status", "todo")
      formData.append("priority", "medium")
      formData.append("dueDate", "2023-12-31")
      formData.append("projectId", "project-id")

      // Mock project
      const mockProject = {
        id: "project-id",
        name: "Test Project",
        userId: "user-id",
      }

      // Mock findUnique to return the project
      prisma.project.findUnique.mockResolvedValue(mockProject)

      // Mock task
      const mockTask = {
        id: "task-id",
        title: "Test Task",
        description: "This is a test task",
        status: "todo",
        priority: "medium",
        dueDate: new Date("2023-12-31"),
        projectId: "project-id",
        assigneeId: "user-id",
      }

      // Mock create to return the new task
      prisma.task.create.mockResolvedValue(mockTask)

      const result = await createTask(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: "Test Task",
          description: "This is a test task",
          status: "todo",
          priority: "medium",
          dueDate: new Date("2023-12-31"),
          projectId: "project-id",
          assigneeId: "user-id",
        },
      })
      expect(result).toEqual({ success: true, taskId: "task-id" })
    })

    it("should return error if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      // Mock form data
      const formData = new FormData()
      formData.append("title", "Test Task")
      formData.append("projectId", "project-id")

      const result = await createTask(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).not.toHaveBeenCalled()
      expect(prisma.task.create).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You must be logged in to create a task"] },
      })
    })

    it("should return error if project does not exist or user does not have permission", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock form data
      const formData = new FormData()
      formData.append("title", "Test Task")
      formData.append("description", "This is a test task")
      formData.append("status", "todo")
      formData.append("priority", "medium")
      formData.append("projectId", "project-id")

      // Mock findUnique to return null (project doesn't exist or user doesn't have permission)
      prisma.project.findUnique.mockResolvedValue(null)

      const result = await createTask(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.task.create).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      })
    })
  })

  describe("updateTaskStatus", () => {
    it("should update a task status and return success", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock task with project
      const mockTask = {
        id: "task-id",
        title: "Test Task",
        status: "todo",
        projectId: "project-id",
        project: {
          id: "project-id",
          userId: "user-id",
        },
      }

      // Mock findUnique to return the task with project
      prisma.task.findUnique.mockResolvedValue(mockTask)

      // Mock update to return the updated task
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        status: "completed",
      })

      const result = await updateTaskStatus("task-id", "completed")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: "task-id" },
        include: { project: true },
      })
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: "task-id" },
        data: { status: "completed" },
      })
      expect(result).toEqual({ success: true })
    })

    it("should return error if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      const result = await updateTaskStatus("task-id", "completed")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.task.findUnique).not.toHaveBeenCalled()
      expect(prisma.task.update).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You must be logged in to update a task"] },
      })
    })

    it("should return error if task does not exist", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock findUnique to return null (task doesn't exist)
      prisma.task.findUnique.mockResolvedValue(null)

      const result = await updateTaskStatus("task-id", "completed")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: "task-id" },
        include: { project: true },
      })
      expect(prisma.task.update).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Task not found"] },
      })
    })

    it("should return error if user does not have permission", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock task with project (different user)
      const mockTask = {
        id: "task-id",
        title: "Test Task",
        status: "todo",
        projectId: "project-id",
        project: {
          id: "project-id",
          userId: "different-user-id",
        },
      }

      // Mock findUnique to return the task with project
      prisma.task.findUnique.mockResolvedValue(mockTask)

      const result = await updateTaskStatus("task-id", "completed")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: "task-id" },
        include: { project: true },
      })
      expect(prisma.task.update).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You do not have permission to update this task"] },
      })
    })
  })
})
