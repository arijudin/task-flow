import { createProject, getProjects, getProject, updateProject, deleteProject } from "../projects"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "../auth"
import jest from "jest"

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

describe("Project Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createProject", () => {
    it("should create a new project and return success", async () => {
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
      formData.append("name", "Test Project")
      formData.append("description", "This is a test project")

      // Mock project
      const mockProject = {
        id: "project-id",
        name: "Test Project",
        description: "This is a test project",
        userId: "user-id",
      }

      // Mock create to return the new project
      prisma.project.create.mockResolvedValue(mockProject)

      const result = await createProject(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          name: "Test Project",
          description: "This is a test project",
          userId: "user-id",
        },
      })
      expect(result).toEqual({ success: true, projectId: "project-id" })
    })

    it("should return error if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      // Mock form data
      const formData = new FormData()
      formData.append("name", "Test Project")
      formData.append("description", "This is a test project")

      const result = await createProject(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.create).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You must be logged in to create a project"] },
      })
    })

    it("should validate input data", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock invalid form data (empty name)
      const formData = new FormData()
      formData.append("name", "")
      formData.append("description", "This is a test project")

      const result = await createProject(formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.create).not.toHaveBeenCalled()
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe("getProjects", () => {
    it("should return projects for the current user", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock projects
      const mockProjects = [
        {
          id: "project-1",
          name: "Project 1",
          description: "Description 1",
          userId: "user-id",
        },
        {
          id: "project-2",
          name: "Project 2",
          description: "Description 2",
          userId: "user-id",
        },
      ]

      // Mock findMany to return the projects
      prisma.project.findMany.mockResolvedValue(mockProjects)

      const result = await getProjects()

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user-id",
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
      expect(result).toEqual(mockProjects)
    })

    it("should return empty array if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      const result = await getProjects()

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findMany).not.toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe("getProject", () => {
    it("should return a project by ID", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock project
      const mockProject = {
        id: "project-id",
        name: "Test Project",
        description: "This is a test project",
        userId: "user-id",
        tasks: [],
      }

      // Mock findUnique to return the project
      prisma.project.findUnique.mockResolvedValue(mockProject)

      const result = await getProject("project-id")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
        include: {
          tasks: {
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      })
      expect(result).toEqual(mockProject)
    })

    it("should return null if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      const result = await getProject("project-id")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe("updateProject", () => {
    it("should update a project and return success", async () => {
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
      formData.append("name", "Updated Project")
      formData.append("description", "This is an updated project")

      // Mock existing project
      const existingProject = {
        id: "project-id",
        name: "Test Project",
        description: "This is a test project",
        userId: "user-id",
      }

      // Mock findUnique to return the existing project
      prisma.project.findUnique.mockResolvedValue(existingProject)

      // Mock update to return the updated project
      prisma.project.update.mockResolvedValue({
        ...existingProject,
        name: "Updated Project",
        description: "This is an updated project",
      })

      const result = await updateProject("project-id", formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "project-id" },
        data: {
          name: "Updated Project",
          description: "This is an updated project",
        },
      })
      expect(result).toEqual({ success: true })
    })

    it("should return error if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      // Mock form data
      const formData = new FormData()
      formData.append("name", "Updated Project")
      formData.append("description", "This is an updated project")

      const result = await updateProject("project-id", formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).not.toHaveBeenCalled()
      expect(prisma.project.update).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You must be logged in to update a project"] },
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
      formData.append("name", "Updated Project")
      formData.append("description", "This is an updated project")

      // Mock findUnique to return null (project doesn't exist or user doesn't have permission)
      prisma.project.findUnique.mockResolvedValue(null)

      const result = await updateProject("project-id", formData)

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.project.update).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      })
    })
  })

  describe("deleteProject", () => {
    it("should delete a project and return success", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock getCurrentUser to return the user
      getCurrentUser.mockResolvedValue(mockUser)

      // Mock existing project
      const existingProject = {
        id: "project-id",
        name: "Test Project",
        description: "This is a test project",
        userId: "user-id",
      }

      // Mock findUnique to return the existing project
      prisma.project.findUnique.mockResolvedValue(existingProject)

      // Mock deleteMany and delete to return success
      prisma.task.deleteMany.mockResolvedValue({ count: 2 })
      prisma.project.delete.mockResolvedValue(existingProject)

      const result = await deleteProject("project-id")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.task.deleteMany).toHaveBeenCalledWith({
        where: { projectId: "project-id" },
      })
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: "project-id" },
      })
      expect(result).toEqual({ success: true })
    })

    it("should return error if user is not logged in", async () => {
      // Mock getCurrentUser to return null (user not logged in)
      getCurrentUser.mockResolvedValue(null)

      const result = await deleteProject("project-id")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).not.toHaveBeenCalled()
      expect(prisma.task.deleteMany).not.toHaveBeenCalled()
      expect(prisma.project.delete).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["You must be logged in to delete a project"] },
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

      // Mock findUnique to return null (project doesn't exist or user doesn't have permission)
      prisma.project.findUnique.mockResolvedValue(null)

      const result = await deleteProject("project-id")

      // Assertions
      expect(getCurrentUser).toHaveBeenCalled()
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: {
          id: "project-id",
          userId: "user-id",
        },
      })
      expect(prisma.task.deleteMany).not.toHaveBeenCalled()
      expect(prisma.project.delete).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      })
    })
  })
})
