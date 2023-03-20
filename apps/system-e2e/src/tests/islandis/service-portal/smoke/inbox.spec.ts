import { test } from '@playwright/test'

test.describe.skip('Pósthólf', () => {
  for (const { testCase, home } of [
    { testCase: 'Pósthólf fitler virki', home: '/en' },
    { testCase: 'Pósthólf skilar gögnum', home: '/' },
    { testCase: 'Pósthólf skjal opnast', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
