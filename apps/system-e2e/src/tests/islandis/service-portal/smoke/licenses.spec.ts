import { test } from '@playwright/test'

test.describe.skip('Skírteini', () => {
  for (const { testCase } of [
    { testCase: 'Skírteini fá upp QR kóða ADR' },
    { testCase: 'Skírteini fá upp QR kóða skotvopnaleyfi' },
    { testCase: 'Skírteini fá upp QR kóða vinnuvéla' },
    { testCase: 'Skírteini fá upp QR kóða ökuskírteinis' },
    { testCase: 'Skírteini sjá ADR detail' },
    { testCase: 'Skírteini sjá ADR skírteini' },
    { testCase: 'Skírteini sjá Skotvopna detail + byssueign' },
    { testCase: 'Skírteini sjá Skotvopna skírteini' },
    { testCase: 'Skírteini sjá Vegabréf barna detail' },
    { testCase: 'Skírteini sjá Vegabréf barna' },
    { testCase: 'Skírteini sjá Vegabréf mitt detail' },
    { testCase: 'Skírteini sjá Vegabréf' },
    { testCase: 'Skírteini sjá Vinnuvéla detail' },
    { testCase: 'Skírteini sjá Vinnuvéla skírteini' },
    { testCase: 'Skírteini sjá Ökuskírteini detail' },
    { testCase: 'Skírteini sjá Ökuskírteini' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
