import { test } from '@playwright/test'

test.describe.skip('Menntun', () => {
  for (const { testCase } of [
    { testCase: 'Menntun samræmd könnunarpróf birtast', home: '/en' },
    { testCase: 'Menntun samræmd könnunarpróf detail', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
