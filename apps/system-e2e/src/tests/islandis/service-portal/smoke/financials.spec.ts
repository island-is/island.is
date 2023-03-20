import { test } from '@playwright/test'

test.describe.skip('Fjármál', () => {
  for (const { testCase } of [
    { testCase: 'Fjármál Greiðslukvittanir - prófa leit og sjá pdf' },
    { testCase: 'Fjármál Hreyfingar - Prófa leit' },
    { testCase: 'Fjármál Launagreidendakröfur - birtist' },
    { testCase: 'Fjármál Staða við ríkissjóð skila gögnum' },
    { testCase: 'Fjármál Útsvar sveitafélaga - birtist ???' },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
