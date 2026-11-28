import { ExternalData, FormValue } from '@island.is/application/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { sumUsageUnitsFireCompensation } from './sumUtils'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal
// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal above 500 million + 150.000kr
export const paymentForAppraisal = (currentAppraisal: number) => {
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

// Unlike the legacy app, SDF display fields do not persist their computed value
// into answers, so we recompute the selected usage units' fire compensation
// from source (answers + externalData) instead of reading a stored answer.
export const getAmountToPay = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const currentAppraisal = Number(
    sumUsageUnitsFireCompensation(answers, externalData),
  )
  if (!currentAppraisal) {
    return ''
  }

  const amountToPay = paymentForAppraisal(currentAppraisal)

  return amountToPay.toString()
}
