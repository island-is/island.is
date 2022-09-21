import { expect, Locator } from '@playwright/test'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

expect.extend({
  async toHaveCountGreaterThan(
    received: Locator,
    value: number,
    options?: { timeout: number },
  ) {
    let count = 0
    for (let i = 0; i < 30; i++) {
      count = await received.count()
      if (!(count > value) && i * 1000 < (options?.timeout ?? 10000))
        await sleep(1000)
      else break
    }
    return {
      message: () => (count > value ? 'passed' : 'failed'),
      pass: count > value,
    }
  },
})
