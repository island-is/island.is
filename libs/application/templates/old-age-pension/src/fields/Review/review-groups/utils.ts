import { taxLevelOptions } from '../../../lib/constants'
import { oldAgePensionFormMessage } from '../../../lib/messages'

export const getTaxLevelOption = (option: taxLevelOptions) => {
  switch (option) {
    case taxLevelOptions.FIRST_LEVEL:
      return oldAgePensionFormMessage.payment.taxFirstLevel
    case taxLevelOptions.SECOND_LEVEL:
      return oldAgePensionFormMessage.payment.taxSecondLevel
    default:
      return oldAgePensionFormMessage.payment.taxIncomeLevel
  }
}
