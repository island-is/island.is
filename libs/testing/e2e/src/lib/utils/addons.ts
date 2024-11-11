import { expect, Locator, Page } from '@playwright/test'
import { sleep } from '../support/utils'

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
        return {
          message: () =>
            `Timeout waiting for element count to exceed ${value}. Current count: ${count}`,
          pass: false,
        }
      await sleep(options.sleepTime)
    }
    return {
      message: () => `Found ${count} elements`,
      pass: true,
    }
  },
  async toBeApplication(
    received: string | Page,
    applicationType = '[a-zA-Z0-9_-]+',
  ) {
    const url: string = typeof received == 'string' ? received : received.url()
    const protocol = 'https?://'
    const host = '[^/]+'
    const applicationId = '(/[a-zA-Z0-9_-]*)?'
    const applicationRegExp = new RegExp(
      `^${protocol}${host}/umsoknir/${applicationType}${applicationId}$`,
    )
    const pass = applicationRegExp.test(url)
    const message = () =>
      [
        `Current page is ${pass ? '' : 'not '}an application`,
        `Expected pattern: ${applicationRegExp}`,
        `Actual URL: ${url}`,
      ].join('\n')
    return { message, pass }
  },
})
