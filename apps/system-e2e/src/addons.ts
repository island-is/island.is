import { expect, Locator } from '@playwright/test'
import { urls } from './support/utils'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

expect.extend({
  async toHaveCountGreaterThan(
    received: Locator,
    value: number,
    options?: { timeoutMs?: number },
  ) {
    let count = 0
    const oneSecondMs = 1000
    const maxRetries = 60
    for (let i = 0; i < maxRetries; i++) {
      count = await received.count()
      if (
        !(count > value) &&
        i * oneSecondMs < (options?.timeoutMs ?? 10 * oneSecondMs)
      )
        await sleep(oneSecondMs)
      else break
    }
    return {
      message: () => (count > value ? 'passed' : 'failed'),
      pass: count > value,
    }
  },

  async toBeApplication(received: string, baseUrl = urls.islandisBaseUrl) {
    const applicationRegExp = new RegExp(
      `^${baseUrl}/umsoknir/okuskoli(/(\\w|-)*)$`,
    )
    const pass = applicationRegExp.test(received)
    const message = () => `Current page is ${pass ? 'not ' : ''} an application`
    return { message, pass }
  },
})
