import { test } from '@playwright/test'

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
