import { TaxLevelOptions } from '../../../lib/constants'
import { oldAgePensionFormMessage } from '../../../lib/messages'

export const getTaxLevelOption = (option: TaxLevelOptions) => {
  switch (option) {
    case TaxLevelOptions.FIRST_LEVEL:
      return oldAgePensionFormMessage.payment.taxFirstLevel
    case TaxLevelOptions.SECOND_LEVEL:
      return oldAgePensionFormMessage.payment.taxSecondLevel
    default:
      return oldAgePensionFormMessage.payment.taxIncomeLevel
  }
}
