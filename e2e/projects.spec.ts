import { test, expect } from "@playwright/test"

test.describe("Projects", () => {
  // Helper function to log in
  async function login(page) {
    await page.goto("/signup")
    const email = `test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")
  }

  test("should allow creating a new project", async ({ page }) => {
    // Log in
    await login(page)

    // Navigate to new project page
    await page.click("text=New Project")

    // Fill in the project form
    await page.fill('input[name="name"]', "Test Project")
    await page.fill('textarea[name="description"]', "This is a test project")

    // Submit the form
    await page.click('button:has-text("Create Project")')

    // Wait for navigation to project page
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Verify project was created
    await expect(page.locator('h1:has-text("Test Project")')).toBeVisible()
    await expect(page.locator('p:has-text("This is a test project")')).toBeVisible()
  })

  test("should show validation errors for invalid project data", async ({ page }) => {
    // Log in
    await login(page)

    // Navigate to new project page
    await page.click("text=New Project")

    // Submit empty form
    await page.click('button:has-text("Create Project")')

    // Verify validation error
    await expect(page.locator("text=Project name is required")).toBeVisible()
  })

  test("should allow viewing project details", async ({ page }) => {
    // Log in
    await login(page)

    // Create a project
    await page.click("text=New Project")
    await page.fill('input[name="name"]', "View Test Project")
    await page.fill('textarea[name="description"]', "Project for testing view")
    await page.click('button:has-text("Create Project")')
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Navigate back to dashboard
    await page.click("text=Dashboard")

    // Click on the project card to view details
    await page.click("text=View Test Project")

    // Verify project details are displayed
    await expect(page.locator('h1:has-text("View Test Project")')).toBeVisible()
    await expect(page.locator('p:has-text("Project for testing view")')).toBeVisible()
  })

  test("should allow adding a task to a project", async ({ page }) => {
    // Log in
    await login(page)

    // Create a project
    await page.click("text=New Project")
    await page.fill('input[name="name"]', "Task Test Project")
    await page.click('button:has-text("Create Project")')
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Add a task
    await page.click("text=Add Task")
    await page.fill('input[name="title"]', "Test Task")
    await page.fill('textarea[name="description"]', "This is a test task")
    await page.click('button:has-text("Create Task")')

    // Verify task was added
    await expect(page.locator("text=Test Task")).toBeVisible()
    await expect(page.locator("text=This is a test task")).toBeVisible()
  })

  test("should allow changing task status", async ({ page }) => {
    // Log in
    await login(page)

    // Create a project
    await page.click("text=New Project")
    await page.fill('input[name="name"]', "Status Test Project")
    await page.click('button:has-text("Create Project")')
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Add a task
    await page.click("text=Add Task")
    await page.fill('input[name="title"]', "Status Test Task")
    await page.click('button:has-text("Create Task")')

    // Start the task
    await page.click('button:has-text("Start Task")')

    // Verify task status changed
    await expect(page.locator("text=In Progress")).toBeVisible()

    // Complete the task
    await page.click('button:has-text("Mark Complete")')

    // Verify task status changed
    await expect(page.locator("text=Completed")).toBeVisible()
  })

  test("should allow deleting a project", async ({ page }) => {
    // Log in
    await login(page)

    // Create a project
    await page.click("text=New Project")
    await page.fill('input[name="name"]', "Delete Test Project")
    await page.click('button:has-text("Create Project")')
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Navigate back to dashboard
    await page.click("text=Dashboard")
    await page.click("text=Projects")

    // Delete the project
    await page.click("text=Delete Test Project")
    await page.click('button[aria-label="Actions"]')
    await page.click("text=Delete")
    await page.click('button:has-text("Delete")')

    // Verify project was deleted
    await expect(page.locator("text=Delete Test Project")).not.toBeVisible()
  })
})
