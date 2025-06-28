import { expect as playwrightExpect } from '@playwright/test'
import { isApplication } from '../lib/modules/application'

const customExpect = playwrightExpect.extend({
  async toBeApplication(page, expectedPath?: string) {
    try {
      await page.waitForURL('**/umsoknir/**')
      const pass = isApplication(page, expectedPath)

      if (pass) {
        return {
          message: () => 'passed',
          pass: true,
        }
      } else {
        const applicationUrl = new URL(page.url())
        const pathSegments = applicationUrl.pathname.split('/').filter(Boolean)
        pathSegments.pop() // uuid segment
        pathSegments.pop() // umsoknir segment

        let message = 'expected page to be an application page'
        if (!isApplication(page)) {
          // Check without expectedPath to see if it's an application page at all
          message += ' (UUID or "umsoknir" segment missing/invalid).'
        } else if (
          expectedPath &&
          !applicationUrl.pathname.includes(expectedPath)
        ) {
          message += ` (Application URL does not contain the expected path: ${expectedPath}. Current URL: ${applicationUrl.pathname}).`
        }
        return {
          message: () => message,
          pass: false,
        }
      }
    } catch (error) {
      return {
        message: () => `toBeApplication failed: ${error.message}`,
        pass: false,
      }
    }
  },
})

export { customExpect as applicationExpect }
