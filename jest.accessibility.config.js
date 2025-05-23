const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "<rootDir>/accessibility/setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/accessibility/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
}

module.exports = createJestConfig(customJestConfig)
