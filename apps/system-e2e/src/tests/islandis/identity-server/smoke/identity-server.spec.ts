import { test } from '@playwright/test'

test.describe.skip('Innsrkáning', () => {
  for (const { testCase } of [
    { testCase: 'Aðgangsstýring - Eyða umboði' },
    { testCase: 'Aðgangsstýring - Gefa umboð sem einstaklingur' },
    { testCase: 'Aðgangsstýring - Gefa umboð sem fyrirtæki' },
    { testCase: 'Aðgangsstýring - Gefa umboð á annað kerfi' },
    { testCase: 'Aðgangsstýring - Kanna að bara ákv. umboð sjáist' },
    { testCase: 'Aðgangsstýring - Kanna að notandi missi umboð' },
    { testCase: 'Aðgangsstýring - Kanna að öll umboð sjáist' },
    { testCase: 'Aðgangsstýring - Veita eitt umboð' },
    { testCase: 'Aðgangsstýring - Veita öll umboð' },
    { testCase: 'Innskráning app' },
    { testCase: 'Innskráning simi' },
    { testCase: 'Innskráning umboð forsjáraðili' },
    { testCase: 'Innskráning umboð fyrirtæki' },
    { testCase: 'Innskráning umboð gefið af öðrum' },
    { testCase: 'Innskráning á ensku' },
    { testCase: 'Innsrkáning kort' },
    { testCase: 'Útskrá ' },
    { testCase: 'Útskrá → Session timeout ' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
