import { render } from "@testing-library/react"
import { axe } from "./setup"
import LoginPage from "@/app/login/page"
import SignupPage from "@/app/signup/page"
import jest from "jest" // Declare the jest variable

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock actions
jest.mock("@/app/actions/auth", () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

describe("Accessibility Tests for Pages", () => {
  it("Login page should not have accessibility violations", async () => {
    const { container } = render(<LoginPage />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it("Signup page should not have accessibility violations", async () => {
    const { container } = render(<SignupPage />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
