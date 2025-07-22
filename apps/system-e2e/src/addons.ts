import { expect, Locator, Page } from '@playwright/test'
import { sleep } from './support/utils'

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
  async toBeApplication(received: string | Page, applicationType = '\\w+') {
    const url: string = typeof received == 'string' ? received : received.url()
    const protocol = 'https?://'
    const host = '[^/]+'
    const applicationId = '(/(\\w|-)*)?'
    const applicationRegExp = new RegExp(
      `^${protocol}${host}/umsoknir/${applicationType}${applicationId}$`,
    )
    const pass = applicationRegExp.test(url)
    const message = () =>
      `Current page is ${pass ? '' : '*not* '}an application
       Pattern ${applicationRegExp}
       URL is  ${url}`
    return { message, pass }
  },
})
