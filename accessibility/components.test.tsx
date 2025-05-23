import { render } from "@testing-library/react"
import { axe } from "./setup"
import { ProjectCard } from "@/app/dashboard/projects/project-card"
import { TaskCard } from "@/app/dashboard/projects/[id]/task-card"
import jest from "jest" // Declare the jest variable

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock actions
jest.mock("@/app/actions/projects", () => ({
  deleteProject: jest.fn(),
}))

jest.mock("@/app/actions/tasks", () => ({
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
}))

describe("Accessibility Tests", () => {
  it("ProjectCard should not have accessibility violations", async () => {
    const mockProject = {
      id: "project-id",
      name: "Test Project",
      description: "This is a test project",
      status: "active",
      createdAt: new Date(),
    }

    const { container } = render(<ProjectCard project={mockProject} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it("TaskCard should not have accessibility violations", async () => {
    const mockTask = {
      id: "task-id",
      title: "Test Task",
      description: "This is a test task",
      status: "todo",
      priority: "medium",
      dueDate: new Date("2023-12-31"),
      projectId: "project-id",
    }

    const { container } = render(<TaskCard task={mockTask} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
