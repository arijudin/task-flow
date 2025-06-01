import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">TaskFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage Your Projects with Ease
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    TaskFlow helps teams organize, track, and manage their work
                    in a visual, productive, and rewarding way.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="px-8">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button variant="outline" size="lg">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <div className="absolute top-8 left-8 right-8 h-[320px] bg-white rounded-lg shadow-lg p-6 dark:bg-gray-900">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Project Dashboard</h3>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900">
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800">
                          <h4 className="text-sm font-medium mb-2">To Do</h4>
                          <div className="space-y-2">
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">Design new landing page</p>
                            </div>
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">Update user profiles</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800">
                          <h4 className="text-sm font-medium mb-2">
                            In Progress
                          </h4>
                          <div className="space-y-2">
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">API integration</p>
                            </div>
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">Fix notification bug</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-800">
                          <h4 className="text-sm font-medium mb-2">
                            Completed
                          </h4>
                          <div className="space-y-2">
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">User authentication</p>
                            </div>
                            <div className="bg-white p-2 rounded border dark:bg-gray-900 dark:border-gray-700">
                              <p className="text-xs">Database setup</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your projects efficiently
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-700">
                <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-700">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Team Collaboration</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Work together with your team in real-time with shared boards
                  and tasks.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-700">
                <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Create, assign, and track tasks with customizable workflows
                  and deadlines.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm dark:border-gray-700">
                <div className="rounded-full bg-gray-200 p-3 dark:bg-gray-700">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Time Tracking</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Monitor time spent on tasks and projects to improve
                  productivity and billing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TaskFlow. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
