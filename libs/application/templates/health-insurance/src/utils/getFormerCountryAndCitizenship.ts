import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { requireWaitingPeriod } from '../healthInsuranceUtils'

export const getFormerCountryAndCitizenship = (answers: FormValue) => {
  const formerCountry = getValueViaPath(
    answers,
    'formerInsurance.country',
  ) as string
  const citizenship = getValueViaPath(answers, 'citizenship') as string
  return { formerCountry, citizenship }
}

export const formerInsuranceCondition = (answers: FormValue) => {
  const { formerCountry, citizenship } = getFormerCountryAndCitizenship(answers)
  return !requireWaitingPeriod(formerCountry, citizenship)
}
