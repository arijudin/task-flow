import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

// Create a separate Prisma client for chaos testing
const prisma = new PrismaClient()

// Function to introduce random delays in database operations
export function withRandomDelay<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    // Random delay between 0 and 2000ms
    const delay = Math.random() * 2000
    setTimeout(async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}

// Function to randomly fail operations
export function withRandomFailure<T>(fn: () => Promise<T>, failureRate = 0.2): Promise<T> {
  return new Promise((resolve, reject) => {
    if (Math.random() < failureRate) {
      reject(new Error("Random failure injected"))
    } else {
      fn().then(resolve).catch(reject)
    }
  })
}

// Function to corrupt data randomly
export function withRandomCorruption<T>(fn: () => Promise<T>, corruptionRate = 0.1): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await fn()

      if (Math.random() < corruptionRate) {
        // For objects, corrupt a random property
        if (typeof result === "object" && result !== null) {
          const keys = Object.keys(result as object)
          if (keys.length > 0) {
            const randomKey = keys[Math.floor(Math.random() * keys.length)]
            const corruptedResult = { ...(result as object) }
            // @ts-ignore
            corruptedResult[randomKey] = randomBytes(8).toString("hex")
            resolve(corruptedResult as T)
            return
          }
        }
      }

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to simulate network issues
export function withNetworkIssues<T>(fn: () => Promise<T>, issueRate = 0.15): Promise<T> {
  return new Promise((resolve, reject) => {
    if (Math.random() < issueRate) {
      // Simulate a timeout
      setTimeout(() => {
        reject(new Error("Network timeout"))
      }, 5000)
    } else {
      fn().then(resolve).catch(reject)
    }
  })
}

// Function to create a chaos proxy for Prisma
export function createChaosProxy() {
  return new Proxy(prisma, {
    get(target, prop) {
      const original = target[prop as keyof typeof target]

      // If it's a model (e.g., user, project, task)
      if (typeof original === "object" && original !== null) {
        return new Proxy(original, {
          get(modelTarget, modelProp) {
            const modelMethod = modelTarget[modelProp as keyof typeof modelTarget]

            // If it's a method (e.g., findUnique, create)
            if (typeof modelMethod === "function") {
              return (...args: any[]) => {
                const operation = () => modelMethod.apply(modelTarget, args)

                // Apply chaos
                return withRandomDelay(() =>
                  withRandomFailure(() => withRandomCorruption(() => withNetworkIssues(operation))),
                )
              }
            }

            return modelMethod
          },
        })
      }

      return original
    },
  })
}

// Function to clean up after chaos testing
export async function cleanupChaosTest() {
  await prisma.$disconnect()
}
