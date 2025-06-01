"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/app/actions/projects";

export default function NewProjectPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});

    const result = await createProject(formData);

    if (result.success) {
      router.push(`/dashboard/projects/${result.projectId}`);
    } else {
      setErrors(result.errors || {});
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-6 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Add a new project to organize your tasks.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter project name"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description[0]}</p>
              )}
            </div>

            {errors._form && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{errors._form[0]}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
