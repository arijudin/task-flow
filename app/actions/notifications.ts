"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

// Get notifications for current user
export async function getNotifications(limit = 10, includeRead = false) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const whereClause = includeRead ? { userId: user.id } : { userId: user.id, isRead: false }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return notifications
  } catch (error) {
    console.error("Get notifications error:", error)
    return []
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to update notifications"] },
    }
  }

  try {
    await prisma.notification.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to update notification. Please try again."] },
    }
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      errors: { _form: ["You must be logged in to update notifications"] },
    }
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to update notifications. Please try again."] },
    }
  }
}

// Create a notification
export async function createNotification({
  userId,
  title,
  message,
  type,
  relatedId,
  relatedType,
}: {
  userId: string
  title: string
  message: string
  type: string
  relatedId?: string
  relatedType?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        relatedId,
        relatedType,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Create notification error:", error)
    return {
      success: false,
      errors: { _form: ["Failed to create notification."] },
    }
  }
}

// Helper function to create task due notification
export async function createTaskDueNotification(taskId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    })

    if (!task || !task.assignee || !task.dueDate) return { success: false }

    // Only create notification if due date is within 24 hours
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours > 0 && diffHours <= 24) {
      await createNotification({
        userId: task.assignee.id,
        title: "Task Due Soon",
        message: `Task "${task.title}" in project "${task.project.name}" is due in ${Math.ceil(diffHours)} hours.`,
        type: "task_due",
        relatedId: task.id,
        relatedType: "task",
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Create task due notification error:", error)
    return { success: false }
  }
}

// Helper function to create task assigned notification
export async function createTaskAssignedNotification(taskId: string, assignerId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    })

    if (!task || !task.assignee || task.assignee.id === assignerId) return { success: false }

    await createNotification({
      userId: task.assignee.id,
      title: "Task Assigned",
      message: `You have been assigned to task "${task.title}" in project "${task.project.name}".`,
      type: "task_assigned",
      relatedId: task.id,
      relatedType: "task",
    })

    return { success: true }
  } catch (error) {
    console.error("Create task assigned notification error:", error)
    return { success: false }
  }
}

// Helper function to create project update notification
export async function createProjectUpdateNotification(projectId: string, updateMessage: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
      },
    })

    if (!project) return { success: false }

    await createNotification({
      userId: project.user.id,
      title: "Project Update",
      message: `Update for project "${project.name}": ${updateMessage}`,
      type: "project_update",
      relatedId: project.id,
      relatedType: "project",
    })

    return { success: true }
  } catch (error) {
    console.error("Create project update notification error:", error)
    return { success: false }
  }
}
