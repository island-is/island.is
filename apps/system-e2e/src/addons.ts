import { expect, Locator, Page } from '@playwright/test'

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
  async toBeApplication(received: string | Page, ofType = '\\w+') {
    const url: string = typeof received == 'string' ? received : received.url()
    const applicationRegExp = new RegExp(
      `^https?://[^/]+/umsoknir/${ofType}(/(\\w|-)*)?$`,
    )
    const pass = !!applicationRegExp.test(url)
    const message = () =>
      `Current page is ${pass ? '' : '*not* '}an application
       Pattern ${applicationRegExp}
       URL is  ${url}`
    return { message, pass }
  },
})
