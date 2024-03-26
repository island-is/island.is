import { getValueViaPath } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { InheritanceReportInfo } from '@island.is/clients/syslumenn'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'
import { YES } from '../constants'

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
  const lotRegex = /^[Ll]{0,1}\d{6}$/
  const houseRegex = /^[Ff]{0,1}\d{7}$/

  return lotRegex.test(value) || houseRegex.test(value)
}

export const getDeceasedHadAssets = (application: Application): boolean =>
  application?.answers &&
  getValueViaPath(application.answers, 'deceasedHadAssets') === YES &&
  getValueViaPath(application.answers, 'deceasedWasMarried') === YES
