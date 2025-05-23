import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { getProject } from "@/app/actions/projects"
import { TaskCard } from "./task-card"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  // Group tasks by status
  const todoTasks = project.tasks.filter((task) => task.status === "todo")
  const inProgressTasks = project.tasks.filter((task) => task.status === "in-progress")
  const completedTasks = project.tasks.filter((task) => task.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || "No description"}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/projects/${project.id}/edit`}>Edit Project</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.id}/tasks/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">To Do</h2>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                  {todoTasks.length}
                </span>
              </div>
              {todoTasks.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">In Progress</h2>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  {inProgressTasks.length}
                </span>
              </div>
              {inProgressTasks.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Completed</h2>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {completedTasks.length}
                </span>
              </div>
              {completedTasks.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>View all tasks in this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h2 className="text-lg font-medium">No tasks yet</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Create your first task to get started.</p>
                  <Button asChild className="mt-4">
                    <Link href={`/dashboard/projects/${project.id}/tasks/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Task
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
