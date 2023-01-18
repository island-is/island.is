import { test } from '@playwright/test'

test.describe.skip('Óflokkað', () => {
  for (const { testCase, home } of [
    { testCase: 'Mínar upplýsingar detail á barni', home: '/en' },
    {
      testCase: 'Mínar síður birtir bara þá flokka sem fyrirtæki eiga að sjá',
      home: '/',
    },
    { testCase: 'Útsvar sveitafélaga - birtist ???', home: '/' },
    { testCase: 'Mínar síður á ensku ', home: '/en' },
    { testCase: 'Starfsleyfi kennara birtast', home: '/en' },
    { testCase: 'Launagreidendakröfur - birtist', home: '/en' },
    { testCase: 'Mínar síður fyrirtæki - Um fyrirtæki', home: '/' },
    { testCase: 'Mínar upplýsingar notendur birast', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
