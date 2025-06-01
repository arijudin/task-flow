import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getProject } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import { EditTaskForm } from "./components/edit-task-form";

interface TaskEditPageProps {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  // Extract project ID and task ID from the params
  const { id, taskId } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Find the specific task
  const task = project.tasks.find((t) => t.id === taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="md:hidden">
              <Link href={`/dashboard/projects/${project.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold md:text-2xl">
              Edit Task: {task.title}
            </h1>
          </div>
          <p className="text-muted-foreground">Project: {project.name}</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/projects/${project.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" size="sm">
            Save Changes
          </Button>
        </div>
      </div>

      <EditTaskForm task={task} projectId={project.id} />
    </div>
  );
}
