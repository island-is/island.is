import { getTypesOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { getApplicationExternalData } from './getApplicationAnswers'
import {
  ISK,
  INCOME,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { YES } from '@island.is/application/core'

export const updateIncomeTypeValue = (
  application: Application,
  activeField?: Record<string, string>,
) => {
  const { categorizedIncomeTypes = [] } = getApplicationExternalData(
    application.externalData,
  )

  const options = getTypesOptions(
    categorizedIncomeTypes,
    activeField?.incomeCategory,
  )
  const selectedOption = options.find(
    (option) => option.value === activeField?.incomeType,
  )?.value
  return selectedOption ?? null
}

export const updateEqualIncomePerMonth = (
  activeField?: Record<string, string>,
  foreign?: boolean,
) => {
  const unevenAndEmploymentIncome =
    activeField?.unevenIncomePerYear?.[0] !== YES ||
    (activeField?.incomeCategory !== INCOME &&
      activeField?.unevenIncomePerYear?.[0] === YES)

  if (
    activeField?.income === RatioType.MONTHLY &&
    (foreign ? activeField?.currency !== ISK : activeField?.currency === ISK) &&
    unevenAndEmploymentIncome
  ) {
    return Math.round(Number(activeField?.incomePerYear) / 12).toString()
  }
  return undefined
}

export const updateIncomePerYear = (activeField?: Record<string, string>) => {
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
