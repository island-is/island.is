import { expect } from '@playwright/test'
import { isApplication } from '../modules/application'

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeApplication(): R
    }
  }
}

expect.extend({
  toBeApplication(received) {
    const pass = isApplication(received)
    if (pass) {
      return {
        message: () => `expected ${received} not to be an application`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be an application`,
        pass: false,
      }
    }
  },
})