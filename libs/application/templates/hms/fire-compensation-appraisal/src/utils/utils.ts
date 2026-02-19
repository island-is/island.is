import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal
// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal
const paymentForAppraisal = (currentAppraisal: number) => {
  const paymentFor500Million = 150000
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return (
      Math.round((currentAppraisal - 500000000) * 0.0001) + paymentFor500Million
    )
  }

  return Math.round(currentAppraisal * 0.0003)
}

export const getAmountToPay = (answers: FormValue) => {
  const currentAppraisal = getValueViaPath<number>(
    answers,
    'usageUnitsFireCompensation',
  )
  if (!currentAppraisal) {
    return ''
  }

  const amountToPay = paymentForAppraisal(currentAppraisal)

  return amountToPay.toString()
}
