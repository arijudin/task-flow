import { test, expect } from "@playwright/test"

// Helper function to log in
async function login(page) {
  await page.goto("/login")
  await page.fill('input[name="email"]', "test@example.com")
  await page.fill('input[name="password"]', "password123")
  await page.click('button[type="submit"]')
  await page.waitForURL("/dashboard")
}

test.describe("Visual Regression Tests", () => {
  test("Homepage should match snapshot", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      animations: "disabled",
    })
  })

  test("Login page should match snapshot", async ({ page }) => {
    await page.goto("/login")
    await expect(page).toHaveScreenshot("login.png", {
      fullPage: true,
      animations: "disabled",
    })
  })

  test("Signup page should match snapshot", async ({ page }) => {
    await page.goto("/signup")
    await expect(page).toHaveScreenshot("signup.png", {
      fullPage: true,
      animations: "disabled",
    })
  })

  test("Dashboard should match snapshot", async ({ page }) => {
    // First create a test user and log in
    await page.goto("/signup")
    await page.fill('input[name="name"]', "Visual Test User")
    await page.fill('input[name="email"]', `visual-test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")

    // Take screenshot of dashboard
    await expect(page).toHaveScreenshot("dashboard.png", {
      fullPage: true,
      animations: "disabled",
    })
  })

  test("Project page should match snapshot", async ({ page }) => {
    // Log in
    await page.goto("/signup")
    await page.fill('input[name="name"]', "Visual Test User")
    await page.fill('input[name="email"]', `visual-test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")

    // Create a project
    await page.click("text=New Project")
    await page.fill('input[name="name"]', "Visual Test Project")
    await page.fill('textarea[name="description"]', "Project for visual testing")
    await page.click('button:has-text("Create Project")')
    await page.waitForURL(/\/dashboard\/projects\/.*/)

    // Take screenshot of project page
    await expect(page).toHaveScreenshot("project-page.png", {
      fullPage: true,
      animations: "disabled",
    })
  })
})
