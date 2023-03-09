import { test } from '@playwright/test'

test.describe.skip('Umsóknir', () => {
  for (const { testCase, home } of [
    {
      testCase: 'Búa til umsókn kvörtun til persónuverndar - vistast sem draft',
      home: '/en',
    },
    {
      testCase: 'Eyða umsókn kvörtun til persónuverndar / Fæðingarorlof',
      home: '/en',
    },
    {
      testCase: 'Eyða umsókn um sakavottorð - Krafa felld niður á MS',
      home: '/en',
    },
    {
      testCase: 'Umsókn fram og til baka í ferli í fæðingarorlofi',
      home: '/en',
    },
    { testCase: 'Umsókn fæðingarorlof fer til enda', home: '/en' },
    { testCase: 'Umsókn setja viðhengi → Kvörtun til PV', home: '/en' },
    { testCase: 'Umsókn um P-kort í umboði virkar', home: '/en' },
    { testCase: 'Umsókn um sakavottorð fer til enda', home: '/en' },
    {
      testCase: 'Umsókn um sakavottorð á ekki að vera í boði í umboði',
      home: '/en',
    },
    { testCase: 'Umsókn um sakavottorð á ensku', home: '/en' },
    {
      testCase: 'Umsókn uppfletting fyrirtækjaskrá - Umsókn um samstarf',
      home: '/en',
    },
  ]) {
    test(testCase, () => {
      return
    })
  }
})
