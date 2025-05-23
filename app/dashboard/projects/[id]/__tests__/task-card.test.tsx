import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskCard } from "../task-card"
import { deleteTask, updateTaskStatus } from "@/app/actions/tasks"
import jest from "jest" // Declare the jest variable

// Mock the task actions
jest.mock("@/app/actions/tasks", () => ({
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
}))

describe("TaskCard", () => {
  const mockTask = {
    id: "task-id",
    title: "Test Task",
    description: "This is a test task",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2023-12-31"),
    projectId: "project-id",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders task details correctly", () => {
    render(<TaskCard task={mockTask} />)

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByText("This is a test task")).toBeInTheDocument()
    expect(screen.getByText("Medium Priority")).toBeInTheDocument()
    expect(screen.getByText("Todo")).toBeInTheDocument()
    expect(screen.getByText(/Due:/)).toBeInTheDocument()
  })

  it("shows delete confirmation dialog when delete is clicked", async () => {
    render(<TaskCard task={mockTask} />)

    // Open dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /Actions/i }))

    // Click delete option
    fireEvent.click(screen.getByText("Delete"))

    // Check if confirmation dialog is shown
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText(/This will permanently delete the task/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })

  it("calls deleteTask when delete is confirmed", async () => {
    // Mock successful deletion
    deleteTask.mockResolvedValue({ success: true })

    render(<TaskCard task={mockTask} />)

    // Open dropdown menu
    fireEvent.click(screen.getByRole("button", { name: /Actions/i }))

    // Click delete option
    fireEvent.click(screen.getByText("Delete"))

    // Confirm deletion
    fireEvent.click(screen.getByRole("button", { name: "Delete" }))

    // Check if deleteTask was called with the correct task ID
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith("task-id")
    })
  })

  it('calls updateTaskStatus when "Mark Complete" is clicked', async () => {
    // Mock successful status update
    updateTaskStatus.mockResolvedValue({ success: true })

    render(<TaskCard task={mockTask} />)

    // Click "Mark Complete" button
    fireEvent.click(screen.getByText("Mark Complete"))

    // Check if updateTaskStatus was called with the correct task ID and status
    await waitFor(() => {
      expect(updateTaskStatus).toHaveBeenCalledWith("task-id", "completed")
    })
  })

  it('calls updateTaskStatus when "Start Task" is clicked', async () => {
    // Mock successful status update
    updateTaskStatus.mockResolvedValue({ success: true })

    render(<TaskCard task={mockTask} />)

    // Click "Start Task" button
    fireEvent.click(screen.getByText("Start Task"))

    // Check if updateTaskStatus was called with the correct task ID and status
    await waitFor(() => {
      expect(updateTaskStatus).toHaveBeenCalledWith("task-id", "in-progress")
    })
  })

  it('renders "No description" when description is null', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: null,
    }

    render(<TaskCard task={taskWithoutDescription} />)

    expect(screen.getByText("No description")).toBeInTheDocument()
  })

  it("renders correct status badge for in-progress tasks", () => {
    const inProgressTask = {
      ...mockTask,
      status: "in-progress",
    }

    render(<TaskCard task={inProgressTask} />)

    expect(screen.getByText("In Progress")).toBeInTheDocument()
  })

  it("renders correct status badge for completed tasks", () => {
    const completedTask = {
      ...mockTask,
      status: "completed",
    }

    render(<TaskCard task={completedTask} />)

    expect(screen.getByText("Completed")).toBeInTheDocument()
  })

  it("renders correct priority badge for low priority tasks", () => {
    const lowPriorityTask = {
      ...mockTask,
      priority: "low",
    }

    render(<TaskCard task={lowPriorityTask} />)

    expect(screen.getByText("Low Priority")).toBeInTheDocument()
  })

  it("renders correct priority badge for high priority tasks", () => {
    const highPriorityTask = {
      ...mockTask,
      priority: "high",
    }

    render(<TaskCard task={highPriorityTask} />)

    expect(screen.getByText("High Priority")).toBeInTheDocument()
  })
})
