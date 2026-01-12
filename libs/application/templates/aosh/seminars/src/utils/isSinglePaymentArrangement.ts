import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IndividualOrCompany } from '../shared/types'
import { PaymentArrangementType } from '../shared/types'
import { isApplyingForMultiple } from './isApplyingForMultiple'

export const isSinglePaymentArrangement = (answers: FormValue): boolean => {
  const paymentArrangementAnswers = getValueViaPath<PaymentArrangementType>(
    answers,
    'paymentArrangement',
  )

  const userIsApplyingForMultiple = isApplyingForMultiple(answers)
  return (
    !userIsApplyingForMultiple ||
    paymentArrangementAnswers?.individualOrCompany ===
      IndividualOrCompany.individual
  )
}
