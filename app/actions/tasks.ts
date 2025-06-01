"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project ID is required"),
})

export async function createTask(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to create a task"] },
    }
  }

  const validatedFields = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, status, priority, dueDate, projectId } = validatedFields.data

  try {
    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    })

    if (!project) {
      return {
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: user.id,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, taskId: task.id }
  } catch (error) {
    console.error("Create task error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to create task. Please try again."] },
    }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to update a task"] },
    }
  }

  try {
    // Get the task to check permissions and get the project ID
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    })

    if (!task) {
      return {
        success: false,
        errors: { _form: ["Task not found"] },
      }
    }

    // Check if the project belongs to the user
    if (task.project.userId !== user.id) {
      return {
        success: false,
        errors: { _form: ["You do not have permission to update this task"] },
      }
    }

    // Update the task status
    await prisma.task.update({
      where: { id },
      data: { status },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Update task status error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to update task status. Please try again."] },
    }
  }
}

export async function updateTask(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to update a task"] },
    }
  }

  const validatedFields = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    projectId: formData.get("projectId"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, status, priority, dueDate, projectId } = validatedFields.data

  try {
    // Get the task to check permissions
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    })

    if (!task) {
      return {
        success: false,
        errors: { _form: ["Task not found"] },
      }
    }

    // Check if the project belongs to the user
    if (task.project.userId !== user.id) {
      return {
        success: false,
        errors: { _form: ["You do not have permission to update this task"] },
      }
    }

    // Update the task
    await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Update task error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to update task. Please try again."] },
    }
  }
}

export async function deleteTask(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to delete a task"] },
    }
  }

  try {
    // Get the task to check permissions and get the project ID
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    })

    if (!task) {
      return {
        success: false,
        errors: { _form: ["Task not found"] },
      }
    }

    // Check if the project belongs to the user
    if (task.project.userId !== user.id) {
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete this task"] },
      }
    }

    // Delete the task
    await prisma.task.delete({
      where: { id },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Delete task error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to delete task. Please try again."] },
    }
  }
}

export async function getTasks(projectId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    // Check if project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    })

    if (!project) {
      return []
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return tasks
  } catch (error) {
    console.error("Get tasks error:", error)
    return []
  }
}

export async function getTask(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        project: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!task) {
      return null
    }

    // Check if the task belongs to the user
    if (task.project.userId !== user.id) {
      return null
    }

    return task
  } catch (error) {
    console.error("Get task error:", error)
    return null
  }
}
