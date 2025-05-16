import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  BasicChargeItem,
  StaticText,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { ExamCategoriesAndInstructors } from '..'

// TODO: Implement this function when we have more information
// TODO: We do not have charge codes yet but I want to get the rest of the application reviewed so we can test etc.. payment will be added before flag is lifted
export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const examCategories = getValueViaPath<ExamCategoriesAndInstructors[]>(
    application.answers,
    'examCategories',
  )

  let examCounter = 0
  let needsToPayForLicenseCounter = 0
  examCategories?.forEach((item) => {
    if (!item.doesntHaveToPayLicenseFee) needsToPayForLicenseCounter += 1
    examCounter += item.categories.length
  })

  return [
    {
      code: ChargeItemCode.AOSH_PRACTICAL_EXAM_VJ101.toString(),
      quantity: examCounter,
    },
    {
      code: ChargeItemCode.AOSH_PRACTICAL_EXAM_VJ103.toString(),
      quantity: needsToPayForLicenseCounter,
    },
  ]
}

export const getChargeItemsWithExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: StaticText
}> => {
  // Fetch from answers how many examinee and which of those do not need to pay x fee
  const result = []
  result.push({
    chargeItemCode: ChargeItemCode.AOSH_STREET_REGISTRATION_SA102.toString(),
    extraLabel: '',
  })

  return result
}
