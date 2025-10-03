import { YES } from '@island.is/application/core'
import {
  INCOME,
  RatioType,
  ISK,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

export const equalIncomePerMonthCondition = (
  activeField?: Record<string, string>,
  foreign?: boolean,
) => {
  const unevenAndEmploymentIncome =
    activeField?.unevenIncomePerYear?.[0] !== YES ||
    (activeField?.incomeCategory !== INCOME &&
      activeField?.unevenIncomePerYear?.[0] === YES)

  return (
    activeField?.income === RatioType.MONTHLY &&
    (foreign ? activeField?.currency !== ISK : activeField?.currency === ISK) &&
    unevenAndEmploymentIncome
  )
}

export const incomePerYearCondition = (
  activeField?: Record<string, string>,
) => {
  return (
    activeField?.income === RatioType.YEARLY ||
    activeField?.income === RatioType.MONTHLY
  )
}

export const unevenIncomePerYearCondition = (
  activeField?: Record<string, string>,
) => {
  return (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME
  )
}

export const monthInputCondition = (activeField?: Record<string, string>) => {
  return (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME &&
    activeField?.unevenIncomePerYear?.[0] === YES
  )
}
