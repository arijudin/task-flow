import http from "k6/http"
import { sleep, check } from "k6"

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up to 20 users over 30 seconds
    { duration: "1m", target: 20 }, // Stay at 20 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users over 30 seconds
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
}

export default function () {
  // Test homepage
  let res = http.get("http://localhost:3000")
  check(res, {
    "homepage status is 200": (r) => r.status === 200,
    "homepage loads in less than 500ms": (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Test login page
  res = http.get("http://localhost:3000/login")
  check(res, {
    "login page status is 200": (r) => r.status === 200,
    "login page loads in less than 500ms": (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Test signup page
  res = http.get("http://localhost:3000/signup")
  check(res, {
    "signup page status is 200": (r) => r.status === 200,
    "signup page loads in less than 500ms": (r) => r.timings.duration < 500,
  })

  sleep(1)
}
