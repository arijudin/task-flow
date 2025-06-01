import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, CheckCircle, Clock, Plus, Users } from "lucide-react";
import { getProjects } from "../actions/projects";
import { getCurrentUser } from "../actions/auth";
import { redirect } from "next/navigation";
import {
  getTaskStatusDistribution,
  getTaskPriorityDistribution,
  getWeeklyTaskCompletion,
  getProductivitySummary,
  getRecentActivities,
} from "../actions/analytics";
// import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { ProductivitySummary } from "@/components/dashboard/productivity-summary";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const projects = await getProjects();

  // Get recent projects (last 3)
  const recentProjects = projects.slice(0, 3);

  // Count projects by status
  const activeProjects = projects.filter(
    (project) => project.status === "active",
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  ).length;

  // Get analytics data
  // const taskStatusData = await getTaskStatusDistribution();
  // const taskPriorityData = await getTaskPriorityDistribution();
  // const weeklyTaskData = await getWeeklyTaskCompletion();
  const productivityData = await getProductivitySummary();
  const recentActivities = await getRecentActivities();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <Button className="ml-auto" size="sm" asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {projects.length > 0
                    ? `${activeProjects} active`
                    : "No projects yet"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tasks
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {productivityData.totalTasks -
                    productivityData.completedTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  {productivityData.completedTasks} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  Just you for now
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Projects
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {completedProjects > 0 && projects.length > 0
                    ? `${((completedProjects / projects.length) * 100).toFixed(0)}% completion rate`
                    : "No completed projects"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  You have {projects.length} projects in total
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {project.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {project.description
                              ? project.description.length > 50
                                ? `${project.description.substring(0, 50)}...`
                                : project.description
                              : "No description"}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/projects/${project.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {projects.length > 3 && (
                      <div className="text-center">
                        <Button asChild variant="link">
                          <Link href="/dashboard/projects">
                            View all projects
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityTimeline activities={recentActivities} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* <AnalyticsCard
              title="Task Status Distribution"
              description="Distribution of tasks by status"
              type="pie"
              data={taskStatusData}
              dataKey="value"
              nameKey="name"
              colors={["#f59e0b", "#3b82f6", "#10b981"]}
              showLegend={true}
            />
            <AnalyticsCard
              title="Task Priority Distribution"
              description="Distribution of tasks by priority"
              type="pie"
              data={taskPriorityData}
              dataKey="value"
              nameKey="name"
              colors={["#3b82f6", "#f59e0b", "#ef4444"]}
              showLegend={true}
            /> */}
            <ProductivitySummary {...productivityData} />
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            {/* <AnalyticsCard
              title="Weekly Task Completion"
              description="Number of tasks completed per week"
              type="bar"
              data={weeklyTaskData}
              dataKey="tasks"
              nameKey="name"
              colors={["#3b82f6"]}
              showLegend={false}
            /> */}
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  Reports Coming Soon
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We're working on providing detailed reports for your projects
                  and tasks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  Notification Settings Coming Soon
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We're working on providing detailed notification settings for
                  your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
