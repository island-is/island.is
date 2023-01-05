import { test } from '@playwright/test'
import { urls } from '../../../support/urls'

test.use({ baseURL: urls.islandisBaseUrl })

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
