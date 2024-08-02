import { expect, Locator, sleep } from '@island.is/playwright-tests'

expect.extend({
  async toHaveCountGreaterThan(
    received: Locator,
    value: number,
    options: { timeout: number; sleepTime: number } = {
      timeout: 10000,
      sleepTime: 100,
    },
  ) {
    const initialTime = Date.now()
    let count = -1
    while (count <= value) {
      count = await received.count()
      if (Date.now() > initialTime + options.timeout)
        return { message: () => 'Timeout', pass: false }
      await sleep(options.sleepTime)
    }
    return {
      message: () => `Found ${count} elements`,
      pass: true,
    }
  },
})
