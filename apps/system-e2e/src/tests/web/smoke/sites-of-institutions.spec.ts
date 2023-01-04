import { test } from '@playwright/test'

test.describe.skip('Sites of institutions', () => {
  for (const { institution, home } of [
    { institution: 'Utlendingastofnun', home: '/' },
    { institution: 'HSN', home: '/en' },
    { institution: 'Sjukratryggingar', home: '/en' },
    { institution: 'Fiskistofa', home: '/en' },
  ]) {
    test(`Vefir stofnana - ${institution}`, () => {
      return
    })
  }
})
