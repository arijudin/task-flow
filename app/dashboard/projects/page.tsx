import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { ProjectCard } from "./project-card";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6 container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-lg font-medium">No projects yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
