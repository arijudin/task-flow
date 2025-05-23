import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ProjectCard } from "../project-card"
import { deleteProject } from "@/app/actions/projects"
import jest from "jest" // Import jest to declare it

// Mock the deleteProject action
jest.mock("@/app/actions/projects", () => ({
  deleteProject: jest.fn(),
}))

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

describe("ProjectCard", () => {
  const mockProject = {
    id: "project-id",
    name: "Test Project",
    description: "This is a test project",
    status: "active",
    createdAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders project details correctly", () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText("Test Project")).toBeInTheDocument()
    expect(screen.getByText("This is a test project")).toBeInTheDocument()
    expect(screen.getByText(/Status:/)).toBeInTheDocument()
    expect(screen.getByText("active", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("View Project")).toBeInTheDocument()
  })

  it("shows delete confirmation dialog when delete is clicked", async () => {
    render(<ProjectCard project={mockProject} />)

    // Open dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /Actions/i }))

    // Click delete option
    fireEvent.click(screen.getByText("Delete"))

    // Check if confirmation dialog is shown
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText(/This will permanently delete the project/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("calls deleteProject when delete is confirmed", async () => {
    // Mock successful deletion
    deleteProject.mockResolvedValue({ success: true })

    render(<ProjectCard project={mockProject} />)

    // Open dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /Actions/i }))

    // Click delete option
    fireEvent.click(screen.getByText("Delete"))

    // Confirm deletion
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    // Check if deleteProject was called with the correct project ID
    await waitFor(() => {
      expect(deleteProject).toHaveBeenCalledWith("project-id")
    })
  })

  it("handles failed deletion", async () => {
    // Mock failed deletion
    deleteProject.mockResolvedValue({
      success: false,
      errors: { _form: ["Failed to delete project"] },
    })

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {})

    render(<ProjectCard project={mockProject} />)

    // Open dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /Actions/i }))

    // Click delete option
    fireEvent.click(screen.getByText("Delete"))

    // Confirm deletion
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    // Check if deleteProject was called
    await waitFor(() => {
      expect(deleteProject).toHaveBeenCalledWith("project-id")
      expect(console.error).toHaveBeenCalled()
    })

    // Restore console.error
    console.error.mockRestore()
  })

  it('renders "No description" when description is null', () => {
    const projectWithoutDescription = {
      ...mockProject,
      description: null,
    }

    render(<ProjectCard project={projectWithoutDescription} />)

    expect(screen.getByText("No description")).toBeInTheDocument()
  })
})
