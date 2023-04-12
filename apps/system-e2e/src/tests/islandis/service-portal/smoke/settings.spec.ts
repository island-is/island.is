import { test } from '@playwright/test'

test.describe.skip('Stillingar', () => {
  for (const { testCase, home } of [
    { testCase: 'Stillingar - breyta banka', home: '/en' },
    { testCase: 'Stillingar - breyta email', home: '/en' },
    { testCase: 'Stillingar - breyta hnipp', home: '/' },
    { testCase: 'Stillingar - breyta síma', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
