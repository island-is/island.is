import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const payPrivatePensionFund = (answers: FormValue) => {
  const payPrivatePensionFund = getValueViaPath<string>(
    answers,
    'payout.payPrivatePensionFund',
  )
  return payPrivatePensionFund === YES
}

export const payToUnion = (answers: FormValue) => {
  const payToUnion = getValueViaPath<string>(answers, 'payout.payToUnion')
  return payToUnion === YES
}

export const doesNotpayToUnion = (answers: FormValue) => {
  const payToUnion = getValueViaPath<string>(answers, 'payout.payToUnion')
  return payToUnion === NO
}

export const doYouHaveVacationDays = (answers: FormValue) => {
  const doYouHaveVacationDays = getValueViaPath<string>(
    answers,
    'vacation.doYouHaveVacationDays',
  )
  return doYouHaveVacationDays === YES
}
