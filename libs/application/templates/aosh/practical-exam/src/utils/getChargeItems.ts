import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'
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

  const items: Array<BasicChargeItem> = [
    {
      code: ChargeItemCode.AOSH_PRACTICAL_EXAM_VJ172.toString(),
      quantity: examCounter,
    },
  ]

  if (needsToPayForLicenseCounter > 0) {
    items.push({
      code: ChargeItemCode.AOSH_PRACTICAL_EXAM_VJ171.toString(),
      quantity: needsToPayForLicenseCounter,
    })
  }

  return items
}
