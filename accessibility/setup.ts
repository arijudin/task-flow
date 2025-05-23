import { configureAxe } from "jest-axe"

// Configure axe for accessibility testing
export const axe = configureAxe({
  rules: {
    // Add specific rule configurations here
    "color-contrast": { enabled: true },
    "aria-roles": { enabled: true },
    "aria-required-attr": { enabled: true },
    "aria-required-children": { enabled: true },
    "aria-required-parent": { enabled: true },
    "aria-valid-attr": { enabled: true },
    "aria-valid-attr-value": { enabled: true },
  },
})
