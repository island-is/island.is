import { test } from '@playwright/test'

test.describe.skip('Greiðsluáætlun', () => {
  for (const { testCase, home } of [
    {
      testCase:
        'Greiðsluáætlun undirsíða - Sjá gamlar og/eða ef staða við ríkissjóð ',
      home: '/',
    },
    { testCase: 'Greiðsluáætlun - Gera umsókn', home: '/en' },
    {
      testCase: 'Greiðsluáætlun - takki birtist ef staða við ríkissjóð',
      home: '/en',
    },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
