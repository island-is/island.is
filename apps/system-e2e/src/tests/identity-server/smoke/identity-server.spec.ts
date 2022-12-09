import { test } from '@playwright/test'

test.describe.skip('Innsrkáning', () => {
  for (const { testCase, home } of [
    { testCase: 'Gefa umboð sem fyrirtæki', home: '/en' },
    { testCase: 'Gefa umboð á annað kerfi', home: '/en' },
    { testCase: 'Útskrá → Session timeout ', home: '/en' },
    { testCase: 'Innsrkáning kort', home: '/en' },
    { testCase: 'Innskráning á ensku', home: '/en' },
    { testCase: 'Innskráning umboð forsjáraðili', home: '/en' },
    { testCase: 'Útskrá ', home: '/en' },
    { testCase: 'Innskráning app', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
