module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run build && npm run start",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/login",
        "http://localhost:3000/signup",
        "http://localhost:3000/dashboard",
      ],
      numberOfRuns: 3,
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 2000 }],
        interactive: ["error", { maxNumericValue: 3500 }],
        "max-potential-fid": ["error", { maxNumericValue: 100 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
  },
}
