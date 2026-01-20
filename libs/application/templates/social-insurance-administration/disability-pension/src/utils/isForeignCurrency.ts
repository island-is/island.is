import {
  FOREIGN_BASIC_PENSION,
  FOREIGN_PENSION,
  FOREIGN_INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  DIVIDENDS_IN_FOREIGN_BANKS,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

export const isForeignCurrency = (activeField?: Record<string, string>) => {
  return (
    activeField?.incomeType === FOREIGN_BASIC_PENSION ||
    activeField?.incomeType === FOREIGN_PENSION ||
    activeField?.incomeType === FOREIGN_INCOME ||
    activeField?.incomeType === INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS ||
    activeField?.incomeType === DIVIDENDS_IN_FOREIGN_BANKS
  )
}
