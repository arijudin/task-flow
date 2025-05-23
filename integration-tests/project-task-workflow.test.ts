import { setupTestData, cleanupTestData } from "./setup"
import { login } from "@/app/actions/auth"
import { getProjects, getProject, createProject, updateProject, deleteProject } from "@/app/actions/projects"
import { createTask, updateTaskStatus, deleteTask } from "@/app/actions/tasks"
import { cookies } from "next/headers"
import jest from "jest"

// Mock cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: "" })),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe("Project and Task Workflow Integration", () => {
  let testData: any

  beforeAll(async () => {
    testData = await setupTestData()

    // Mock cookies to return the test user ID
    cookies().get = jest.fn(() => ({ value: testData.user.id }))
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  it("should authenticate a user and retrieve their projects", async () => {
    // Create form data for login
    const formData = new FormData()
    formData.append("email", "integration-test@example.com")
    formData.append("password", "testpassword")

    // Login
    const loginResult = await login(formData)
    expect(loginResult.success).toBe(true)
    expect(loginResult.userId).toBe(testData.user.id)

    // Get projects
    const projects = await getProjects()
    expect(projects.length).toBeGreaterThan(0)
    expect(projects.some((p) => p.id === testData.project.id)).toBe(true)
  })

  it("should create a project, add tasks, and update task status", async () => {
    // Create a new project
    const projectFormData = new FormData()
    projectFormData.append("name", "New Integration Project")
    projectFormData.append("description", "Project created during integration testing")

    const createProjectResult = await createProject(projectFormData)
    expect(createProjectResult.success).toBe(true)
    expect(createProjectResult.projectId).toBeDefined()

    const newProjectId = createProjectResult.projectId as string

    // Get the project to verify it was created
    const project = await getProject(newProjectId)
    expect(project).not.toBeNull()
    expect(project?.name).toBe("New Integration Project")

    // Create a task in the project
    const taskFormData = new FormData()
    taskFormData.append("title", "New Integration Task")
    taskFormData.append("description", "Task created during integration testing")
    taskFormData.append("status", "todo")
    taskFormData.append("priority", "medium")
    taskFormData.append("projectId", newProjectId)

    const createTaskResult = await createTask(taskFormData)
    expect(createTaskResult.success).toBe(true)
    expect(createTaskResult.taskId).toBeDefined()

    const newTaskId = createTaskResult.taskId as string

    // Update task status
    const updateStatusResult = await updateTaskStatus(newTaskId, "in-progress")
    expect(updateStatusResult.success).toBe(true)

    // Get the project again to verify the task was updated
    const updatedProject = await getProject(newProjectId)
    const updatedTask = updatedProject?.tasks.find((t) => t.id === newTaskId)
    expect(updatedTask).toBeDefined()
    expect(updatedTask?.status).toBe("in-progress")

    // Delete the task
    const deleteTaskResult = await deleteTask(newTaskId)
    expect(deleteTaskResult.success).toBe(true)

    // Delete the project
    const deleteProjectResult = await deleteProject(newProjectId)
    expect(deleteProjectResult.success).toBe(true)
  })

  it("should update a project", async () => {
    // Get the test project
    const project = await getProject(testData.project.id)
    expect(project).not.toBeNull()

    // Update the project
    const updateFormData = new FormData()
    updateFormData.append("name", "Updated Integration Project")
    updateFormData.append("description", "Updated during integration testing")

    const updateResult = await updateProject(testData.project.id, updateFormData)
    expect(updateResult.success).toBe(true)

    // Get the project again to verify it was updated
    const updatedProject = await getProject(testData.project.id)
    expect(updatedProject?.name).toBe("Updated Integration Project")
    expect(updatedProject?.description).toBe("Updated during integration testing")
  })
})
