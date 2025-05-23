"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
})

export async function createProject(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to create a project"] },
    }
  }

  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description } = validatedFields.data

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, projectId: project.id }
  } catch (error) {
    console.error("Create project error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to create project. Please try again."] },
    }
  }
}

export async function getProjects() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return projects
  } catch (error) {
    console.error("Get projects error:", error)
    return []
  }
}

export async function getProject(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tasks: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    })

    return project
  } catch (error) {
    console.error("Get project error:", error)
    return null
  }
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to update a project"] },
    }
  }

  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description } = validatedFields.data

  try {
    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return {
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      }
    }

    await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
      },
    })

    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Update project error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to update project. Please try again."] },
    }
  }
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to delete a project"] },
    }
  }

  try {
    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return {
        success: false,
        errors: { _form: ["Project not found or you do not have permission"] },
      }
    }

    // Delete all tasks associated with the project
    await prisma.task.deleteMany({
      where: { projectId: id },
    })

    // Delete the project
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to delete project. Please try again."] },
    }
  }
}
