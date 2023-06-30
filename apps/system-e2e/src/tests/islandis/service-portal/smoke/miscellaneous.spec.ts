import { test } from '@playwright/test'

test.describe.skip('Óflokkað', () => {
  for (const { testCase, home } of [
    {
      testCase: 'Mínar síður birtir bara þá flokka sem fyrirtæki eiga að sjá',
      home: '/',
    },
    { testCase: 'Mínar síður fyrirtæki - Um fyrirtæki', home: '/' },
    { testCase: 'Mínar síður á ensku ', home: '/en' },
    { testCase: 'Útsvar sveitafélaga - birtist ???', home: '/' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
