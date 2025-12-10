import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { IndividualOrCompany, PaymentOptions } from './enums'

export const isCompany = (answers: FormValue): boolean => {
  const individualOrCompany = getValueViaPath<IndividualOrCompany>(
    answers,
    'paymentArrangement.individualOrCompany',
  )
  return individualOrCompany === IndividualOrCompany.company
}

export const isCompanyAndInvoice = (answers: FormValue): boolean => {
  const isCompanyBool = isCompany(answers)
  const invoiceOrCash = getValueViaPath<PaymentOptions>(
    answers,
    'paymentArrangement.paymentOptions',
  )
  const isInvoice = invoiceOrCash === PaymentOptions.putIntoAccount
  return isCompanyBool && isInvoice
}
