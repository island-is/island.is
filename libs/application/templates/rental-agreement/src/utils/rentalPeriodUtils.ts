import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from './enums'
import { applicationAnswers } from '../shared'

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

const indexData = [
  {
    date: '2025M07',
    indexRate: '651,0',
  },
  {
    date: '2025M06',
    indexRate: '649,7',
  },
  {
    date: '2025M05',
    indexRate: '643,7',
  },
  {
    date: '2025M04',
    indexRate: '641,3',
  },
  {
    date: '2024M12',
    indexRate: '634,1',
  },
  {
    date: '2025M03',
    indexRate: '635,5',
  },
  {
    date: '2025M02',
    indexRate: '637,2',
  },
  {
    date: '2025M01',
    indexRate: '634,7',
  },
]

export const formatIndexRateDateToIcelandic = (dateString: string): string => {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(5, 7)

  const icelandicMonths: Record<string, string> = {
    '01': 'Janúar',
    '02': 'Febrúar',
    '03': 'Mars',
    '04': 'Apríl',
    '05': 'Maí',
    '06': 'Júní',
    '07': 'Júlí',
    '08': 'Ágúst',
    '09': 'September',
    '10': 'Október',
    '11': 'Nóvember',
    '12': 'Desember',
  }

  return `${icelandicMonths[month]} ${year}`
}

export const getIndexDateOptions = () => {
  const sortedIndexData = [...indexData].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  return sortedIndexData.map((item: { date: string }, index: number) => ({
    value: item.date,
    label: formatIndexRateDateToIcelandic(item.date),
  }))
}
export const getIndexRateForDate = (answers: FormValue) => {
  const { indexDate } = applicationAnswers(answers)

  const selectedIndex = indexData.find(
    (item: { date: string; indexRate: string }) => item.date === indexDate,
  )

  if (!indexDate) return ''

  return selectedIndex ? selectedIndex.indexRate : ''
}
