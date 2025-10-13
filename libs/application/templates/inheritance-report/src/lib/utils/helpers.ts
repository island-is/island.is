import { NationalRegistrySpouse } from '@island.is/api/schema'
import { EMAIL_REGEX, YES, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { InheritanceReportInfo } from '@island.is/clients/syslumenn'
import { DebtTypes as ClientDebtType } from '@island.is/clients/syslumenn'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import type { Answers } from '../../types'
import { DebtTypes } from '../../types'
import { PrePaidInheritanceOptions } from '../constants'
import { InheritanceReport } from '../dataSchema'

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const isValidString = (string: string | undefined) => {
  return string && /\S/.test(string)
}

export const getEstateDataFromApplication = (
  application: Application<FormValue>,
): { inheritanceReportInfo?: InheritanceReportInfo } => {
  const selectedEstate = application.answers.estateInfoSelection

  const estateData = (
    application.externalData.syslumennOnEntry?.data as {
      inheritanceReportInfos?: Array<InheritanceReportInfo>
    }
  ).inheritanceReportInfos?.find(
    (estate) => estate.caseNumber === selectedEstate,
  )

  return {
    inheritanceReportInfo: estateData,
  }
}

export const parseDebtType = (debtType: ClientDebtType) => {
  switch (debtType) {
    case 'propertyFees':
      return DebtTypes.PropertyFees
    case 'overdraft':
      return DebtTypes.Overdraft
    case 'creditCard':
      return DebtTypes.CreditCard
    case 'insuranceCompany':
      return DebtTypes.InsuranceInstitute
    case 'loan':
      return DebtTypes.Loan
    case 'duties':
      return DebtTypes.PublicCharges
    default:
      return DebtTypes.OtherDebts
  }
}

export const getSpouseFromExternalData = (
  externalData: ExternalData,
): NationalRegistrySpouse | undefined => {
  const spouse = getValueViaPath(externalData, 'maritalStatus.data', {}) as
    | NationalRegistrySpouse
    | undefined

  return spouse
}

export const getPrePaidOverviewSectionsToDisplay = (
  isPrePaid: boolean,
  answers: FormValue,
) => {
  const selectedOptions = getValueViaPath<string[]>(
    answers,
    'prepaidInheritance',
    [],
  )

  return {
    includeRealEstate: isPrePaid
      ? selectedOptions?.includes(PrePaidInheritanceOptions.REAL_ESTATE)
      : true,
    includeStocks: isPrePaid
      ? selectedOptions?.includes(PrePaidInheritanceOptions.STOCKS)
      : true,
    includeMoney: isPrePaid
      ? selectedOptions?.includes(PrePaidInheritanceOptions.MONEY)
      : true,
    includeOtherAssets: isPrePaid
      ? selectedOptions?.includes(PrePaidInheritanceOptions.OTHER_ASSETS)
      : true,
  }
}

export const getPrePaidTotalValueFromApplication = (
  application: Application<FormValue>,
): number => {
  const { answers } = application
  const money = valueToNumber(
    getValueViaPath(answers, 'assets.money.value', '0'),
  )
  const stocksTotal =
    getValueViaPath<number>(answers, 'assets.stocks.total', 0) ?? 0
  const realEstateTotal =
    getValueViaPath<number>(answers, 'assets.realEstate.total', 0) ?? 0
  const otherAssetsTotal =
    getValueViaPath<number>(answers, 'assets.otherAssets.total', 0) ?? 0
  const bankAccountTotal =
    getValueViaPath<number>(answers, 'assets.bankAccounts.total', 0) ?? 0
  return (
    money + stocksTotal + realEstateTotal + otherAssetsTotal + bankAccountTotal
  )
}

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/\D/g, '').slice(-7)
}

/**
 * Returns zero if value is not a number or number string
 * @param value
 * @returns number
 */
export const valueToNumber = (value: unknown, delimiter = '.'): number => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value.length > 0) {
    const regex = new RegExp(`[^-${delimiter}\\d]+`, 'g')
    const regex2 = new RegExp(`(?<=\\${delimiter}.*)\\${delimiter}`, 'g')
    const regex3 = new RegExp('(?!^)-', 'g')

    const parsed = value
      .replace(regex, '')
      .replace(regex2, '')
      .replace(regex3, '')
    return parseFloat(parsed.replace(delimiter, '.'))
  }

  return 0
}

export const isValidRealEstate = (value: string) => {
  const assetNumberPattern = /^[Ff]{0,1}\d{7}$|^[Ll]{0,1}\d{6}$/
  return assetNumberPattern.test(value)
}

export const parseLabel = (
  label: MessageDescriptor | { [key: string]: MessageDescriptor },
  answers: Answers | undefined,
): MessageDescriptor => {
  if (isMessageDescriptor(label)) {
    return label
  }
  const applicationFor: string = answers?.applicationFor as string
  return label[applicationFor]
}

export const isMessageDescriptor = (obj: any): obj is MessageDescriptor => {
  return (
    obj &&
    typeof obj === 'object' &&
    ('id' in obj || 'defaultMessage' in obj || 'description' in obj)
  )
}

export const getDeceasedWasMarriedAndHadAssets = (
  application: Application,
): boolean =>
  application?.answers &&
  getDeceasedHadAssets(application) &&
  getDeceasedWasInCohabitation(application)

export const getDeceasedHadAssets = (application: Application): boolean =>
  application?.answers &&
  getValueViaPath(application.answers, 'customShare.deceasedHadAssets') === YES

export const getDeceasedWasInCohabitation = (
  application: Application,
): boolean =>
  application?.answers &&
  getValueViaPath(application.answers, 'customShare.deceasedWasMarried') === YES

export const shouldShowDeceasedShareField = (answers: FormValue) =>
  getValueViaPath(answers, 'customShare.deceasedHadAssets') === YES &&
  getValueViaPath(answers, 'customShare.deceasedWasMarried') === YES

export const shouldShowCustomSpouseShare = (answers: FormValue) =>
  getValueViaPath(answers, 'customShare.deceasedWasMarried') === YES

export const roundedValueToNumber = (value: unknown) =>
  Math.round(valueToNumber(value))

export const showTaxFreeInOverview = (answers: FormValue) => {
  const total = (answers as InheritanceReport)?.heirs?.data?.reduce(
    (sum, heir) => sum + valueToNumber(heir.taxFreeInheritance),
    0,
  )
  return !!total && total > 0
}

export const includeSpouse = (answers: FormValue) =>
  Boolean(
    getValueViaPath<Array<string>>(answers, 'executors.includeSpouse')?.length,
  )
