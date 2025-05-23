import { signup, login, getCurrentUser } from "../auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jest from "jest" // Declare the jest variable

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => "hashed-password"),
  compare: jest.fn(() => true),
}))

// Mock prisma
jest.mock("@/lib/prisma")

describe("Auth Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("signup", () => {
    it("should create a new user and return success", async () => {
      // Mock form data
      const formData = new FormData()
      formData.append("name", "Test User")
      formData.append("email", "test@example.com")
      formData.append("password", "password123")

      // Mock prisma response
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
        password: "hashed-password",
      }

      // Mock findUnique to return null (user doesn't exist)
      prisma.user.findUnique.mockResolvedValue(null)

      // Mock create to return the new user
      prisma.user.create.mockResolvedValue(mockUser)

      const result = await signup(formData)

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      })
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "hashed-password",
        },
      })
      expect(result).toEqual({ success: true, userId: "user-id" })
    })

    it("should return error if user already exists", async () => {
      // Mock form data
      const formData = new FormData()
      formData.append("name", "Test User")
      formData.append("email", "existing@example.com")
      formData.append("password", "password123")

      // Mock existing user
      const existingUser = {
        id: "existing-user-id",
        email: "existing@example.com",
      }

      // Mock findUnique to return an existing user
      prisma.user.findUnique.mockResolvedValue(existingUser)

      const result = await signup(formData)

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "existing@example.com" },
      })
      expect(prisma.user.create).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { email: ["User with this email already exists"] },
      })
    })

    it("should validate input data", async () => {
      // Mock invalid form data
      const formData = new FormData()
      formData.append("name", "T") // Too short
      formData.append("email", "invalid-email") // Invalid email
      formData.append("password", "short") // Too short

      const result = await signup(formData)

      // Assertions
      expect(prisma.user.findUnique).not.toHaveBeenCalled()
      expect(prisma.user.create).not.toHaveBeenCalled()
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe("login", () => {
    it("should login a user and return success", async () => {
      // Mock form data
      const formData = new FormData()
      formData.append("email", "test@example.com")
      formData.append("password", "password123")

      // Mock user
      const mockUser = {
        id: "user-id",
        email: "test@example.com",
        password: "hashed-password",
      }

      // Mock findUnique to return the user
      prisma.user.findUnique.mockResolvedValue(mockUser)

      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true)

      const result = await login(formData)

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashed-password")
      expect(result).toEqual({ success: true, userId: "user-id" })
    })

    it("should return error if user does not exist", async () => {
      // Mock form data
      const formData = new FormData()
      formData.append("email", "nonexistent@example.com")
      formData.append("password", "password123")

      // Mock findUnique to return null (user doesn't exist)
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await login(formData)

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "nonexistent@example.com" },
      })
      expect(bcrypt.compare).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Invalid email or password"] },
      })
    })

    it("should return error if password is incorrect", async () => {
      // Mock form data
      const formData = new FormData()
      formData.append("email", "test@example.com")
      formData.append("password", "wrong-password")

      // Mock user
      const mockUser = {
        id: "user-id",
        email: "test@example.com",
        password: "hashed-password",
      }

      // Mock findUnique to return the user
      prisma.user.findUnique.mockResolvedValue(mockUser)

      // Mock bcrypt.compare to return false (password doesn't match)
      bcrypt.compare.mockResolvedValue(false)

      const result = await login(formData)

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      })
      expect(bcrypt.compare).toHaveBeenCalledWith("wrong-password", "hashed-password")
      expect(result).toEqual({
        success: false,
        errors: { _form: ["Invalid email or password"] },
      })
    })
  })

  describe("getCurrentUser", () => {
    it("should return the current user", async () => {
      // Mock user
      const mockUser = {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
      }

      // Mock findUnique to return the user
      prisma.user.findUnique.mockResolvedValue(mockUser)

      const result = await getCurrentUser()

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      expect(result).toEqual(mockUser)
    })

    it("should return null if no user is found", async () => {
      // Mock findUnique to return null (user doesn't exist)
      prisma.user.findUnique.mockResolvedValue(null)

      const result = await getCurrentUser()

      // Assertions
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      expect(result).toBeNull()
    })
  })
})
