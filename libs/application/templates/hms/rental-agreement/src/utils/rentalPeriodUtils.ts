import format from 'date-fns/format'
import parse from 'date-fns/parse'
import is from 'date-fns/locale/is'
import startOfDay from 'date-fns/startOfDay'
import addYears from 'date-fns/addYears'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from './enums'
import { applicationAnswers, ConsumerIndexItem } from '../shared'

// Amount utils
export const rentalAmountConnectedToIndex = (answers: FormValue) => {
  const { isIndexConnected } = applicationAnswers(answers)
  return isIndexConnected?.includes(YesOrNoEnum.YES) || false
}

export const rentalPaymentDateIsOther = (answers: FormValue) => {
  const { paymentDateOptions } = applicationAnswers(answers)
  return paymentDateOptions === RentalAmountPaymentDateOptions.OTHER
}

export const rentalPaymentMethodIsBankTransfer = (answers: FormValue) => {
  const { paymentMethodOptions } = applicationAnswers(answers)
  return paymentMethodOptions === RentalPaymentMethodOptions.BANK_TRANSFER
}

export const rentalPaymentMethodIsOther = (answers: FormValue) => {
  const { paymentMethodOptions } = applicationAnswers(answers)
  return paymentMethodOptions === RentalPaymentMethodOptions.OTHER
}

export const rentalInsuranceRequired = (answers: FormValue) => {
  const { securityDepositRequired } = applicationAnswers(answers)
  return securityDepositRequired?.includes(YesOrNoEnum.YES) || false
}

// Details utils
export const rentalPeriodIsDefinite = (answers: FormValue) => {
  const { isDefinite } = applicationAnswers(answers)
  return isDefinite?.includes(YesOrNoEnum.YES) || false
}

export const isDateMoreThanOneYearInFuture = (answers: FormValue) => {
  const startDate = getValueViaPath<string>(answers, 'rentalPeriod.startDate')
  if (!startDate) return false

  const parsedDate = new Date(startDate)

  if (!isFinite(parsedDate.getTime())) {
    return false
  }

  const oneYearFromNow = startOfDay(addYears(new Date(), 1))
  const selectedDay = startOfDay(parsedDate)

  return selectedDay > oneYearFromNow
}

// Other fees utils
export const housingFundAmountPayedByTenant = (answers: FormValue) => {
  const { housingFundPayee } = applicationAnswers(answers)
  return housingFundPayee === OtherFeesPayeeOptions.TENANT
}

export const electricityCostPayedByTenant = (answers: FormValue) => {
  const { electricityCostPayee } = applicationAnswers(answers)
  return electricityCostPayee === OtherFeesPayeeOptions.TENANT
}

export const heatingCostPayedByTenant = (answers: FormValue) => {
  const { heatingCostPayee } = applicationAnswers(answers)
  return heatingCostPayee === OtherFeesPayeeOptions.TENANT
}

export const otherFeesPayedByTenant = (answers: FormValue) => {
  const { otherCostPayedByTenant } = applicationAnswers(answers)
  return otherCostPayedByTenant?.includes(YesOrNoEnum.YES) || false
}

// Security deposit utils
export const securityDepositRequired = (answers: FormValue) => {
  const { securityDepositRequired } = applicationAnswers(answers)
  return securityDepositRequired?.includes(YesOrNoEnum.YES) || false
}

const checkSecurityDepositType = (
  answers: FormValue,
  typeToCheck: SecurityDepositTypeOptions,
): boolean => {
  const { securityDepositRequired } = applicationAnswers(answers)
  const { securityType } = applicationAnswers(answers)
  return (
    Boolean(securityDepositRequired?.includes(YesOrNoEnum.YES)) &&
    Boolean(securityType) &&
    securityType === typeToCheck
  )
}

export const securityDepositIsOther = (answers: FormValue): boolean =>
  checkSecurityDepositType(answers, SecurityDepositTypeOptions.OTHER)

export const securityDepositIsBankGuarantee = (answers: FormValue): boolean =>
  checkSecurityDepositType(answers, SecurityDepositTypeOptions.BANK_GUARANTEE)

export const securityDepositIsCapital = (answers: FormValue): boolean =>
  checkSecurityDepositType(answers, SecurityDepositTypeOptions.CAPITAL)

export const securityDepositIsThirdPartyGuarantee = (
  answers: FormValue,
): boolean =>
  checkSecurityDepositType(
    answers,
    SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE,
  )

export const securityDepositIsInsuranceCompany = (
  answers: FormValue,
): boolean =>
  checkSecurityDepositType(
    answers,
    SecurityDepositTypeOptions.INSURANCE_COMPANY,
  )

export const securityDepositIsLandlordsMutualFund = (
  answers: FormValue,
): boolean =>
  checkSecurityDepositType(
    answers,
    SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND,
  )

export const securityDepositIsNotLandlordsMutualFund = (answers: FormValue) => {
  const securityDeposit = getValueViaPath<string[]>(answers, 'securityDeposit')
  const { securityType } = applicationAnswers(answers)
  return (
    !securityDeposit ||
    securityType === undefined ||
    securityType !== SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
  )
}

export const securityDepositIsLandlordsMutualFundOrOther = (
  answers: FormValue,
) => {
  const securityDeposit = getValueViaPath<string[]>(answers, 'securityDeposit')
  const { securityType } = applicationAnswers(answers)
  const { securityDepositAmount } = applicationAnswers(answers)
  return (
    securityDeposit &&
    (securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
      securityDepositAmount === SecurityDepositAmountOptions.OTHER)
  )
}

export const calculateSecurityDepositAmount = (answers: FormValue) => {
  const { securityAmountHiddenRentalAmount } = applicationAnswers(answers)
  const { securityDepositAmount } = applicationAnswers(answers)

  const monthMapping = {
    [SecurityDepositAmountOptions.ONE_MONTH]: 1,
    [SecurityDepositAmountOptions.TWO_MONTHS]: 2,
    [SecurityDepositAmountOptions.THREE_MONTHS]: 3,
  }

  const months = securityDepositAmount
    ? monthMapping[securityDepositAmount as keyof typeof monthMapping]
    : 0
  return (Number(securityAmountHiddenRentalAmount ?? '0') * months).toString()
}

const formatMonthsWithLocale = (dateString: string): string => {
  try {
    if (dateString.includes('T')) {
      const date = new Date(dateString)
      return format(date, 'MMMM yyyy', { locale: is })
    }
    const parsedDate = parse(dateString, 'yyyyMMM', new Date(), {
      locale: is,
    })

    return format(parsedDate, 'MMMM yyyy', { locale: is })
  } catch (error) {
    return dateString
  }
}

export const getConsumerIndexDateOptions = (
  application: Application,
): Array<{ value: string; label: string }> => {
  const consumerIndexArray = application.externalData?.consumerIndex?.data

  if (!consumerIndexArray || !Array.isArray(consumerIndexArray)) {
    return []
  }

  const typedArray: ConsumerIndexItem[] = consumerIndexArray

  return [...typedArray]
    .sort((a, b) => b.month.localeCompare(a.month))
    .map(({ month }) => ({
      value: month,
      label: formatMonthsWithLocale(month),
    }))
}

export const getIndexRateForConsumerIndexDate = (
  answers: FormValue,
  externalData: ExternalData,
): string | undefined => {
  const { isIndexConnected, indexDate } = applicationAnswers(answers)

  if (!isIndexConnected?.includes(YesOrNoEnum.YES) || !indexDate) {
    return undefined
  }

  const consumerIndexArray = externalData.consumerIndex?.data

  if (!consumerIndexArray || !Array.isArray(consumerIndexArray)) {
    return undefined
  }

  const typedArray: ConsumerIndexItem[] = consumerIndexArray
  const selectedIndex = typedArray.find((item) => item.month === indexDate)

  return selectedIndex?.value
}
