import { YES } from '@island.is/application/core'
import {
  DIVIDENDS_IN_FOREIGN_BANKS,
  FOREIGN_BASIC_PENSION,
  FOREIGN_INCOME,
  FOREIGN_PENSION,
  INCOME,
  INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS,
  ISK,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { getTypesOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { ExternalData } from '@island.is/application/types'
import { shouldShowEqualIncomePerMonth } from './conditionUtils'
import { getApplicationExternalData } from './medicalAndRehabilitationPaymentsUtils'

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
  externalData: ExternalData,
  activeField?: Record<string, string>,
) => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)
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
