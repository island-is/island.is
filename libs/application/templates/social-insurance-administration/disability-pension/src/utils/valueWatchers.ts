import { YES } from '@island.is/application/core'
import {
  RatioType,
  INCOME,
  ISK,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { MONTH_NAMES } from '../types/constants'

export const watchIncomePerYearValue = (
  activeField?: Record<string, string>,
) => {
  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME &&
    activeField?.unevenIncomePerYear?.[0] === YES
  ) {
    return MONTH_NAMES
  }
  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.currency === ISK
  ) {
    return 'equalIncomePerMonth'
  }
  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.currency !== ISK
  ) {
    return 'equalForeignIncomePerMonth'
  }
  return undefined
}
