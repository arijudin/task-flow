import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should allow a user to sign up", async ({ page }) => {
    // Navigate to the signup page
    await page.goto("/signup")

    // Fill in the signup form
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', "password123")

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for navigation to dashboard
    await page.waitForURL("/dashboard")

    // Verify we're on the dashboard
    expect(page.url()).toContain("/dashboard")
  })

  test("should show error for existing email during signup", async ({ page }) => {
    // First, create a user
    await page.goto("/signup")
    const email = `test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")

    // Logout
    await page.goto("/logout")
    await page.waitForURL("/")

    // Try to sign up with the same email
    await page.goto("/signup")
    await page.fill('input[name="name"]', "Another User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password456")
    await page.click('button[type="submit"]')

    // Verify error message
    await expect(page.locator("text=User with this email already exists")).toBeVisible()
  })

  test("should allow a user to log in", async ({ page }) => {
    // First, create a user
    await page.goto("/signup")
    const email = `test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")

    // Logout
    await page.goto("/logout")
    await page.waitForURL("/")

    // Log in with the created user
    await page.goto("/login")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')

    // Wait for navigation to dashboard
    await page.waitForURL("/dashboard")

    // Verify we're on the dashboard
    expect(page.url()).toContain("/dashboard")
  })

  test("should show error for invalid login", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/login")

    // Fill in the login form with invalid credentials
    await page.fill('input[name="email"]', "nonexistent@example.com")
    await page.fill('input[name="password"]', "wrongpassword")

    // Submit the form
    await page.click('button[type="submit"]')

    // Verify error message
    await expect(page.locator("text=Invalid email or password")).toBeVisible()
  })

  test("should redirect to login when accessing protected routes", async ({ page }) => {
    // Try to access a protected route
    await page.goto("/dashboard")

    // Verify redirect to login
    expect(page.url()).toContain("/login")
  })

  test("should redirect to dashboard when accessing auth pages while logged in", async ({ page }) => {
    // First, create and log in a user
    await page.goto("/signup")
    const email = `test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")

    // Try to access login page while logged in
    await page.goto("/login")

    // Verify redirect to dashboard
    expect(page.url()).toContain("/dashboard")

    // Try to access signup page while logged in
    await page.goto("/signup")

    // Verify redirect to dashboard
    expect(page.url()).toContain("/dashboard")
  })
})
