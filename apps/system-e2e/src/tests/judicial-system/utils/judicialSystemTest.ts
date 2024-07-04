import { Page, test as base } from '@playwright/test'

import {
  JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL,
  JUDICIAL_SYSTEM_DEFENDER_HOME_URL,
  JUDICIAL_SYSTEM_JUDGE_HOME_URL,
} from '../../../support/urls'

import { judicialSystemSession } from '../../../support/session'

export const test = base.extend<{
  prosecutorPage: Page
  judgePage: Page
  coaPage: Page
  defenderPage: Page
}>({
  prosecutorPage: async ({ browser }, use) => {
    const prosecutorContext = await judicialSystemSession({
      browser,
    })
    const prosecutorPage = await prosecutorContext.newPage()
    await use(prosecutorPage)
    await prosecutorPage.close()
    await prosecutorContext.close()
  },
  judgePage: async ({ browser }, use) => {
    const judgeContext = await judicialSystemSession({
      browser,
      homeUrl: JUDICIAL_SYSTEM_JUDGE_HOME_URL,
    })
    const judgePage = await judgeContext.newPage()
    await use(judgePage)
    await judgePage.close()
    await judgeContext.close()
  },
  coaPage: async ({ browser }, use) => {
    const coaContext = await judicialSystemSession({
      browser,
      homeUrl: JUDICIAL_SYSTEM_COA_JUDGE_HOME_URL,
    })
    const coaPage = await coaContext.newPage()
    await use(coaPage)
    await coaPage.close()
    await coaContext.close()
  },
  defenderPage: async ({ browser }, use) => {
    const defenderContext = await judicialSystemSession({
      browser,
      homeUrl: JUDICIAL_SYSTEM_DEFENDER_HOME_URL,
    })
    const defenderPage = await defenderContext.newPage()
    await use(defenderPage)
    await defenderPage.close()
    await defenderContext.close()
  },
})
