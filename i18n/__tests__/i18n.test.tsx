import { render, screen } from "@testing-library/react"
import { I18nextProvider } from "react-i18next"
import i18n from "../i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import jest from "jest" // Declare the jest variable

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("Internationalization", () => {
  beforeEach(() => {
    localStorageMock.clear()
    i18n.changeLanguage("en") // Reset to English
  })

  it("should have translations for all supported languages", () => {
    // Check if translations exist for all languages
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true)
    expect(i18n.hasResourceBundle("id", "translation")).toBe(true)
    expect(i18n.hasResourceBundle("ja", "translation")).toBe(true)
  })

  it("should render LanguageSwitcher component", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    )

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("should load language from localStorage on mount", () => {
    // Set language in localStorage
    localStorageMock.setItem("language", "id")

    // Create a test component that uses i18n
    function TestComponent() {
      return (
        <I18nextProvider i18n={i18n}>
          <div>Test</div>
        </I18nextProvider>
      )
    }

    render(<TestComponent />)

    // Check if language was loaded from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith("language")
    expect(i18n.language).toBe("id")
  })
})
