import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from './enums'

// Amount utils
export const rentalAmountConnectedToIndex = (answers: FormValue) => {
  const isAmountConnectedToIndex = getValueViaPath<string[]>(
    answers,
    'rentalAmount.isIndexConnected',
  )
  return isAmountConnectedToIndex?.includes(YesOrNoEnum.YES) || false
}

export const rentalPaymentDateIsOther = (answers: FormValue) => {
  const paymentDate = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentDateOptions',
  )
  return paymentDate === RentalAmountPaymentDateOptions.OTHER
}

export const rentalPaymentMethodIsBankTransfer = (answers: FormValue) => {
  const paymentMethod = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodOptions',
  )
  return paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
}

export const rentalPaymentMethodIsOther = (answers: FormValue) => {
  const paymentMethod = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodOptions',
  )
  return paymentMethod === RentalPaymentMethodOptions.OTHER
}

export const rentalInsuranceRequired = (answers: FormValue) => {
  const isInsuranceRequired = getValueViaPath<string[]>(
    answers,
    'rentalAmount.securityDepositRequired',
  )
  return isInsuranceRequired?.includes(YesOrNoEnum.YES) || false
}

// Details utils
export const rentalPeriodIsDefinite = (answers: FormValue) => {
  const rentalPeriodDefinite = getValueViaPath<string[]>(
    answers,
    'rentalPeriod.isDefinite',
  )
  return rentalPeriodDefinite?.includes(YesOrNoEnum.YES) || false
}

// Other fees utils
export const housingFundAmountPayedByTenant = (answers: FormValue) => {
  const otherFeesHousingFund = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.housingFund',
  )
  return otherFeesHousingFund === OtherFeesPayeeOptions.TENANT
}

export const electricityCostPayedByTenant = (answers: FormValue) => {
  const otherFeesElectricityCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.electricityCost',
  )
  return otherFeesElectricityCost === OtherFeesPayeeOptions.TENANT
}

export const heatingCostPayedByTenant = (answers: FormValue) => {
  const otherFeesHeatingCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.heatingCost',
  )
  return otherFeesHeatingCost === OtherFeesPayeeOptions.TENANT
}

export const otherFeesPayedByTenant = (answers: FormValue) => {
  const otherFeesOtherCosts = getValueViaPath<string[]>(
    answers,
    'otherFees.otherCosts',
  )
  return otherFeesOtherCosts?.includes(YesOrNoEnum.YES) || false
}

// Security deposit utils
export const securityDepositRequired = (answers: FormValue) => {
  const isInsuranceRequired = getValueViaPath<string[]>(
    answers,
    'rentalAmount.securityDepositRequired',
  )
  return isInsuranceRequired?.includes(YesOrNoEnum.YES) || false
}

const checkSecurityDepositType = (
  answers: FormValue,
  typeToCheck: SecurityDepositTypeOptions,
): boolean => {
  const isInsuranceRequired = getValueViaPath<string[]>(
    answers,
    'rentalAmount.securityDepositRequired',
  )
  const securityType = getValueViaPath<SecurityDepositTypeOptions>(
    answers,
    'securityDeposit.securityType',
  )
  return (
    Boolean(isInsuranceRequired?.includes(YesOrNoEnum.YES)) &&
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
  const securityType = getValueViaPath<SecurityDepositTypeOptions>(
    answers,
    'securityDeposit.securityType',
  )
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
  const securityType = getValueViaPath<SecurityDepositTypeOptions>(
    answers,
    'securityDeposit.securityType',
  )
  const securityAmount = getValueViaPath<SecurityDepositAmountOptions>(
    answers,
    'securityDeposit.securityAmount',
  )
  return (
    securityDeposit &&
    (securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
      securityAmount === SecurityDepositAmountOptions.OTHER)
  )
}

export const calculateSecurityDepositAmount = (answers: FormValue) => {
  const rentalAmount = getValueViaPath<string>(
    answers,
    'securityDeposit.rentalAmount',
  )
  const securityAmount = getValueViaPath<string>(
    answers,
    'securityDeposit.securityAmount',
  )

  const monthMapping = {
    [SecurityDepositAmountOptions.ONE_MONTH]: 1,
    [SecurityDepositAmountOptions.TWO_MONTHS]: 2,
    [SecurityDepositAmountOptions.THREE_MONTHS]: 3,
  }

  const months = securityAmount
    ? monthMapping[securityAmount as keyof typeof monthMapping]
    : 0
  return (parseInt(rentalAmount ?? '0') * months).toString()
}
