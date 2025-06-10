// Utility functions for income plan fields
import { YES } from '@island.is/application/core'
import {
  DIVIDENDS_IN_FOREIGN_BANKS,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  RatioType,
} from '../lib/constants'

export interface IncomeField {
  [key: string]: unknown
  unevenIncomePerYear?: unknown[]
  incomeCategory?: unknown
}

export const shouldShowMonthlyUnevenIncomeField = (
  activeField: IncomeField,
): boolean => {
  return (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME &&
    activeField?.unevenIncomePerYear?.[0] === YES
  )
}

export const getMonths = () => [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export const isUnevenAndEmploymentIncome = (
  activeField: IncomeField | undefined,
): boolean => {
  if (!activeField) {
    return false
  }

  return (
    activeField.unevenIncomePerYear?.[0] !== YES ||
    (activeField.incomeCategory !== INCOME &&
      activeField.unevenIncomePerYear?.[0] === YES)
  )
}

export const isMonthlyIncomeAndCategoryIncome = (activeField?: IncomeField) => {
  return (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME
  )
}

export const showCurrency = (activeField?: IncomeField) => {
  return (
    activeField?.incomeType === FOREIGN_BASIC_PENSION ||
    activeField?.incomeType === FOREIGN_PENSION ||
    activeField?.incomeType === FOREIGN_INCOME ||
    activeField?.incomeType === INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS ||
    activeField?.incomeType === DIVIDENDS_IN_FOREIGN_BANKS
  )
}
