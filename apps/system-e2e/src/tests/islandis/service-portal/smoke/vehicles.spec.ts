import { test } from '@playwright/test'

test.describe.skip('Ökutæki', () => {
  for (const { testCase, home } of [
    { testCase: 'Ökutæki leit - get aðeins leitað 5 x', home: '/' },
    { testCase: 'Ökutækjaferill', home: '/en' },
    { testCase: 'Ökutæki ferilskýrsla + eignastöðuvottorð', home: '/en' },
    { testCase: 'Ökutæki detail', home: '/en' },
    { testCase: 'Ökutæki listi', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
