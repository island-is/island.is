import { test } from '@playwright/test'
import { urls } from '../../../support/utils'

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

  test('Þjónustuvefur opnast - https://island.is/adstod', () => {
    return
  })
  test('Org pages opens https://island.is/s', () => {
    return
  })
  test('Spjallmenni virkar', () => {
    return
  })
})
