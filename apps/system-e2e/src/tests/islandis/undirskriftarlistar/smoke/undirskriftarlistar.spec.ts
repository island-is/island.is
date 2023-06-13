import { test } from '@playwright/test'
import { urls } from '../../../../support/urls'

test.describe('Undirskriftarlistar', () => {
  for (const { testCase } of [
    { testCase: 'Breyta og Eyða undirskriftalista sem admin - TBD' },
    { testCase: 'Búa til undirskriftalista /umsoknir/undirskriftalisti/' },
    { testCase: 'Skoða undirskriftalista /minarsidur/min-gogn/listar' },
    { testCase: 'Skrifa undir undirskriftalista /undirskriftalistar' },
  ]) {
    test.skip(testCase, () => {
      return
    })
  }
})
