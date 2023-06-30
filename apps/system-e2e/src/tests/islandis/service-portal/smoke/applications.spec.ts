import { test } from '@playwright/test'

test.describe.skip('Umsóknir', () => {
  for (const { testCase, home } of [
    { testCase: 'Umsóknir leitast/filterast', home: '/en' },
    { testCase: 'Umsóknir opnar umsókn', home: '/' },
    { testCase: 'Umsóknir skilar umsóknum', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
