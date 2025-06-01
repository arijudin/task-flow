"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { startOfWeek, endOfWeek, subWeeks, differenceInHours } from "date-fns";

// Get task status distribution
export async function getTaskStatusDistribution() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          userId: user.id,
        },
      },
      select: {
        status: true,
      },
    });

    // Count tasks by status
    const statusCounts = tasks.reduce(
      (acc, task) => {
        const status = task.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Format for chart
    return Object.entries(statusCounts).map(([status, count]) => ({
      name:
        status === "todo"
          ? "To Do"
          : status === "in-progress"
            ? "In Progress"
            : "Completed",
      value: count,
    }));
  } catch (error) {
    console.error("Get task status distribution error:", error);
    return [];
  }
}

// Get task priority distribution
export async function getTaskPriorityDistribution() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          userId: user.id,
        },
      },
      select: {
        priority: true,
      },
    });

    // Count tasks by priority
    const priorityCounts = tasks.reduce(
      (acc, task) => {
        const priority = task.priority;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Format for chart
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
    }));
  } catch (error) {
    console.error("Get task priority distribution error:", error);
    return [];
  }
}

// Get weekly task completion
export async function getWeeklyTaskCompletion(weeks = 4) {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  try {
    const now = new Date();
    const result = [];

    // Get data for each week
    for (let i = 0; i < weeks; i++) {
      const endDate = i === 0 ? now : endOfWeek(subWeeks(now, i));
      const startDate = startOfWeek(endDate);

      const completedTasks = await prisma.task.count({
        where: {
          project: {
            userId: user.id,
          },
          status: "completed",
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      result.unshift({
        name: `Week ${weeks - i}`,
        tasks: completedTasks,
      });
    }

    return result;
  } catch (error) {
    console.error("Get weekly task completion error:", error);
    return [];
  }
}

// Get productivity summary
export async function getProductivitySummary() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      completedTasks: 0,
      totalTasks: 0,
      tasksThisWeek: 0,
      tasksLastWeek: 0,
      averageCompletionTime: 0,
    };
  }

  try {
    // Get total and completed tasks
    const totalTasks = await prisma.task.count({
      where: {
        project: {
          userId: user.id,
        },
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        project: {
          userId: user.id,
        },
        status: "completed",
      },
    });

    // Get tasks completed this week
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = now;

    const tasksThisWeek = await prisma.task.count({
      where: {
        project: {
          userId: user.id,
        },
        status: "completed",
        updatedAt: {
          gte: thisWeekStart,
          lte: thisWeekEnd,
        },
      },
    });

    // Get tasks completed last week
    const lastWeekStart = startOfWeek(subWeeks(now, 1));
    const lastWeekEnd = endOfWeek(subWeeks(now, 1));

    const tasksLastWeek = await prisma.task.count({
      where: {
        project: {
          userId: user.id,
        },
        status: "completed",
        updatedAt: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
      },
    });

    // Calculate average completion time (simplified)
    // In a real app, you'd track when a task moves from "todo" to "completed"
    let averageCompletionTime = 0;
    const completedTasksWithDates = await prisma.task.findMany({
      where: {
        project: {
          userId: user.id,
        },
        status: "completed",
        createdAt: {
          not: undefined,
        },
        updatedAt: {
          not: undefined,
        },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (completedTasksWithDates.length > 0) {
      const totalHours = completedTasksWithDates.reduce((sum, task) => {
        return sum + differenceInHours(task.updatedAt, task.createdAt);
      }, 0);
      averageCompletionTime = totalHours / completedTasksWithDates.length;
    }

    return {
      completedTasks,
      totalTasks,
      tasksThisWeek,
      tasksLastWeek,
      averageCompletionTime,
    };
  } catch (error) {
    console.error("Get productivity summary error:", error);
    return {
      completedTasks: 0,
      totalTasks: 0,
      tasksThisWeek: 0,
      tasksLastWeek: 0,
      averageCompletionTime: 0,
    };
  }
}

// Get recent activities
export async function getRecentActivities(limit = 10) {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  try {
    // In a real app, you'd have an Activity model
    // This is a simplified version that generates mock data
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { updatedAt: "desc" },
    });

    const tasks = await prisma.task.findMany({
      where: {
        project: { userId: user.id },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { project: true },
    });

    // Generate mock activities
    const activities = [
      ...projects.map((project) => ({
        id: `project-${project.id}`,
        type: "update_project" as const,
        entityName: project.name,
        timestamp: project.updatedAt,
        userId: user.id,
        userName: user.name || user.email,
      })),
      ...tasks.map((task) => ({
        id: `task-${task.id}`,
        type:
          task.status === "completed"
            ? ("complete_task" as const)
            : ("update_task" as const),
        entityName: task.title,
        timestamp: task.updatedAt,
        userId: user.id,
        userName: user.name || user.email,
      })),
    ];

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Get recent activities error:", error);
    return [];
  }
}
