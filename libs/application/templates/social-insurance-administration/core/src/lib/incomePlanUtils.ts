import { YES } from '@island.is/application/core'
import { CategorizedIncomeTypes, IncomePlanRow } from '../types'
import {
  DIVIDENDS_IN_FOREIGN_BANKS,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  ISK,
  MONTH_NAMES,
  RatioType,
} from './constants'
import {
  getTypesOptions,
  shouldShowEqualIncomePerMonth,
} from './socialInsuranceAdministrationUtils'

export const equalIncomePerMonthValueModifier = (
  isForeign: boolean,
  activeField?: Record<string, string>,
) => {
  if (shouldShowEqualIncomePerMonth(isForeign, activeField)) {
    return Math.round(Number(activeField?.incomePerYear) / 12).toString()
  }
  return undefined
}

export const incomeTypeValueModifier = (
  categorizedIncomeTypes: CategorizedIncomeTypes[],
  activeField?: Record<string, string>,
) => {
  const options = getTypesOptions(
    categorizedIncomeTypes,
    activeField?.incomeCategory,
  )
  const selectedOption = options.find(
    (option) => option.value === activeField?.incomeType,
  )?.value
  return selectedOption ?? null
}

export const currencyValueModifier = (activeField?: Record<string, string>) => {
  const foreignIncomeTypes = [
    FOREIGN_BASIC_PENSION,
    FOREIGN_PENSION,
    FOREIGN_INCOME,
    INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
    DIVIDENDS_IN_FOREIGN_BANKS,
  ]
  return foreignIncomeTypes.includes(activeField?.incomeType ?? '') ? null : ISK
}

export const incomePerYearValueModifier = (
  activeField?: Record<string, string>,
) => {
  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.incomeCategory === INCOME &&
    activeField?.unevenIncomePerYear?.[0] === YES
  ) {
    return (
      Number(activeField?.january ?? 0) +
      Number(activeField?.february ?? 0) +
      Number(activeField?.march ?? 0) +
      Number(activeField?.april ?? 0) +
      Number(activeField?.may ?? 0) +
      Number(activeField?.june ?? 0) +
      Number(activeField?.july ?? 0) +
      Number(activeField?.august ?? 0) +
      Number(activeField?.september ?? 0) +
      Number(activeField?.october ?? 0) +
      Number(activeField?.november ?? 0) +
      Number(activeField?.december ?? 0)
    ).toString()
  }

  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.currency === ISK
  ) {
    return (Number(activeField?.equalIncomePerMonth) * 12).toString()
  }

  if (
    activeField?.income === RatioType.MONTHLY &&
    activeField?.currency !== ISK
  ) {
    return (Number(activeField?.equalForeignIncomePerMonth) * 12).toString()
  }

  return undefined
}

export const incomePerYearWatchValues = (
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

// If income plan table has no income > 0, show alert and question to confirm that applicant has no other income.
// This is to prevent applicants from submitting an income plan with 0 income by mistake.
export const incomePlanHasOnlyZeroIncome = (
  incomePlan: IncomePlanRow[],
): boolean => {
  return (
    incomePlan.length > 0 &&
    incomePlan.every((income) => Number(income.incomePerYear) === 0)
  )
}
