import { createServer } from "http"
import { apiResolver } from "next/dist/server/api-utils/node"
import supertest from "supertest"

// Helper function to create a test server for API routes
export function createTestServer(handler: any, params = {}) {
  const requestHandler = (req: any, res: any) => {
    return apiResolver(req, res, params, handler, {} as any, false)
  }

  const server = createServer(requestHandler)
  return supertest(server)
}
