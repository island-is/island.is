import { test } from '@playwright/test'
import { urls } from '../../../../support/urls'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe.skip('Sites of institutions', () => {
  for (const { testCase } of [
    { testCase: 'Opinberir aðilar', home: '/', },
    { testCase: 'Fiskistofa' },
    { testCase: 'HSN' },
    { testCase: 'Sjúkratryggingar', target: 'Efnisyfirlit' },
    { testCase: 'Ríkislögmaður' },
    { testCase: 'Landskjörstjórn' },
    { testCase: 'Opinber nýsköpun', disabled: true },
    { testCase: 'Sýslumenn' },
    { testCase: 'Fjársýslan' },
    { testCase: 'HSU' },
    { testCase: 'Landlæknir' },
    { testCase: 'Útlendingastofnun' },
  ]) {
    test(`Vefir stofnana - ${testCase}`, () => {
      return
    })
  }
})
