import { test } from '@playwright/test'

test.describe.skip('Fasteignir', () => {
  for (const { testCase, home } of [
    { testCase: 'Fasteignir listi', home: '/en' },
    { testCase: 'Fasteignir detail', home: '/en' },
    { testCase: 'Fasteignir veðbókavottorð opnast', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
