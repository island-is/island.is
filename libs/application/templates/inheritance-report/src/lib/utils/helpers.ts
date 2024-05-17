import { NationalRegistrySpouse } from '@island.is/api/schema'
import { YES, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { InheritanceReportInfo } from '@island.is/clients/syslumenn'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'
import { Answers } from '../../types'

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const isValidString = (string: string | undefined) =>
  string && /\S/.test(string)

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

export const getSpouseFromExternalData = (
  externalData: ExternalData,
): NationalRegistrySpouse | undefined => {
  const spouse = getValueViaPath(externalData, 'maritalStatus.data', {}) as
    | NationalRegistrySpouse
    | undefined

  return spouse
}

export const isApplicantMarried = (externalData: ExternalData) => {
  const spouse = getSpouseFromExternalData(externalData)
  return !!spouse && spouse?.maritalStatus === '3'
}

export const customZodError = (
  zodValidation: ZodTypeAny,
  errorMessage: MessageDescriptor,
): ZodTypeAny => {
  if (zodValidation._def.checks) {
    for (const check of zodValidation._def.checks) {
      check['params'] = errorMessage
      check['code'] = 'custom_error'
    }
  }
  return zodValidation
}

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i

export const isValidEmail = (value: string) => emailRegex.test(value)

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
    const regex = new RegExp(`[^${delimiter}\\d]+`, 'g')
    const regex2 = new RegExp(`(?<=\\${delimiter}.*)\\${delimiter}`, 'g')

    const parsed = value.replace(regex, '').replace(regex2, '')
    return parseFloat(parsed.replace(delimiter, '.'))
  }

  return 0
}

export const isValidRealEstate = (value: string) => {
  const assetNumberPattern = /^(F\d{3}-\d{4}|\d{7}|\d{3}-\d{4}|F\d{7})$/
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
  getValueViaPath(application.answers, 'deceasedHadAssets') === YES

export const getDeceasedWasInCohabitation = (
  application: Application,
): boolean =>
  application?.answers &&
  getValueViaPath(application.answers, 'deceasedWasMarried') === YES

export const hasYes = (arr?: string[]) =>
  Array.isArray(arr) && arr.includes(YES)

export const shouldShowDeceasedShareField = (answers: FormValue) =>
  getValueViaPath(answers, 'deceasedHadAssets') === YES &&
  getValueViaPath(answers, 'deceasedWasMarried') === YES

export const shouldShowCustomSpouseShare = (answers: FormValue) =>
  getValueViaPath(answers, 'deceasedWasMarried') === YES

export const roundedValueToNumber = (value: unknown) =>
  Math.round(valueToNumber(value))
