import { test } from '@playwright/test'

test.describe.skip('Skírteini', () => {
  for (const { testCase, home } of [
    { testCase: 'Skírteini fá upp QR kóða vinnuvéla', home: '/en' },
    { testCase: 'Skírteini fá upp QR kóða skotvopnaleyfi', home: '/' },
    { testCase: 'Skírteini fá upp QR kóða ADR', home: '/en' },
    { testCase: 'Skírteini fá upp QR kóða ökuskírteinis', home: '/' },
    { testCase: 'Skírteini sjá Skotvopna detail + byssueign', home: '/en' },
    { testCase: 'Skírteini sjá Vinnuvéla detail', home: '/en' },
    { testCase: 'Skírteini sjá ADR detail', home: '/' },
    { testCase: 'Skírteini sjá Vinnuvéla skírteini', home: '/en' },
    { testCase: 'Skírteini sjá Skotvopna skírteini', home: '/en' },
    { testCase: 'Skírteini sjá ADR skírteini', home: '/' },
    { testCase: 'Skírteini sjá ökuskírteini', home: '/en' },
    { testCase: 'Skírteini sjá ökuskírteini detail', home: '/en' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
