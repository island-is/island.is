import { TaxLevelOptions } from '../../../lib/constants'
import { additionalSupportForTheElderyFormMessage } from '../../../lib/messages'

export const getTaxLevelOption = (option: TaxLevelOptions) => {
  switch (option) {
    case TaxLevelOptions.FIRST_LEVEL:
      return additionalSupportForTheElderyFormMessage.payment.taxFirstLevel
    case TaxLevelOptions.SECOND_LEVEL:
      return additionalSupportForTheElderyFormMessage.payment.taxSecondLevel
    default:
      return additionalSupportForTheElderyFormMessage.payment.taxIncomeLevel
  }
}
