{
  \
  "scripts\": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:integration": "jest --config=jest.integration.config.js",
    "test:accessibility": "jest --config=jest.accessibility.config.js",
    "test:visual": "playwright test --config=playwright.visual.config.ts",
    "test:performance": "k6 run performance/load-test.js",
    "test:lighthouse": "lhci autorun",
    "test:security": "node security/dependency-check.js && npm audit",
    "test:all": "npm run test && npm run test:integration && npm run test:e2e && npm run test:accessibility && npm run test:visual && npm run test:performance && npm run test:lighthouse && npm run test:security"\
}
,
  "dependencies":
{
  'recharts": "^2.7.2',
    'date-fns": "^2.30.0',
    '@radix-ui/react-radio-group": "^1.1.3',
    '@radix-ui/react-dialog": "^1.0.4'
  \
}
,
  "devDependencies":
{
  '@testing-library/jest-dom": "^6.1.4',
    '@testing-library/react": "^14.0.0',
    '@types/jest": "^29.5.6',
    'jest": "^29.7.0',
    'jest-environment-jsdom": "^29.7.0',
    '@playwright/test": "^1.39.0',
    'jest-axe": "^8.0.0',
    'k6": "^0.46.0',
    '@lhci/cli": "^0.12.0',
    "@sentry/nextjs"
  : "^7.64.0",
    "i18next": "^23.5.1",
    "react-i18next": "^13.2.2",
    "supertest": "^6.3.3"
}
}
