import { test } from '@playwright/test'

test.describe.skip('Fjármál', () => {
  for (const { testCase, home } of [
    { testCase: 'Fjármál Hreyfingar - Prófa leit', home: '/en' },
    { testCase: 'Fjármál Staða við ríkissjóð skila gögnum', home: '/en' },
    {
      testCase: 'Fjármál Greiðslukvittanir - prófa leit og sjá pdf',
      home: '/',
    },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
