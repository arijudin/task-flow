// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import jest from "jest"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}))

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: jest.fn(() => ({ value: "test-user-id" })),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: () => ({
    get: jest.fn(),
  }),
}))
