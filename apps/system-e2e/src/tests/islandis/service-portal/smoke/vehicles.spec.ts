import { test } from '@playwright/test'

test.describe.skip('Ökutæki', () => {
  for (const { testCase, home } of [
    { testCase: 'Ökutæki detail', home: '/en' },
    { testCase: 'Ökutæki ferilskýrsla + eignastöðuvottorð', home: '/en' },
    { testCase: 'Ökutæki leit - get aðeins leitað 5 x', home: '/' },
    { testCase: 'Ökutæki listi', home: '/en' },
    { testCase: 'Ökutækjaferill', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
