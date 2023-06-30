import { test } from '@playwright/test'
import { urls } from '../../../../support/urls'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe.skip('Óflokkað', () => {
  for (const { testCase, home } of [
    { testCase: 'Þjónustuvefur opnast - https://island.is/adstod', home: '/' },
    { testCase: 'Org pages opens https://island.is/s', home: '/en' },
    { testCase: 'Spjallmenni virkar', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
