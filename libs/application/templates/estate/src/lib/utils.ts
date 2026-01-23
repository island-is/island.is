import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { EstateTypes } from './constants'
import { m } from './messages'
import { Application, FormValue } from '@island.is/application/types'
import { EMAIL_REGEX, getValueViaPath } from '@island.is/application/core'

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
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

export const isEstateInfo = (
  data: string | number | boolean | object | undefined,
): data is { estate: EstateInfo } => {
  return (data as { estate: EstateInfo })?.estate?.nameOfDeceased !== undefined
}

export const isValidString = (string: string | undefined) =>
  string && /\S/.test(string)

export const isNumericalString = (string: string | undefined) =>
  string && /^[0-9]+$|^[0-9][0-9,.]+[0-9]$/.test(string)

export const getAssetDescriptionText = (
  application: Application<FormValue>,
) => {
  const { answers } = application
  const selectedEstate = getValueViaPath(answers, 'selectedEstate') || ''

  return selectedEstate === EstateTypes.estateWithoutAssets
    ? m.propertiesDescriptionEstateWithoutAssets
    : selectedEstate === EstateTypes.officialDivision
      ? m.propertiesDescriptionOfficialDivision
      : selectedEstate === EstateTypes.permitForUndividedEstate
        ? m.propertiesDescriptionUndividedEstate
        : m.propertiesDescriptionDivisionOfEstateByHeirs
}

export const getWillsAndAgreementsDescriptionText = (
  application: Application<FormValue>,
) => {
  const { answers } = application
  const selectedEstate = getValueViaPath(answers, 'selectedEstate') || ''

  return selectedEstate === EstateTypes.estateWithoutAssets
    ? m.willsAndAgreementsDescriptionEstateWithoutAssets
    : selectedEstate === EstateTypes.officialDivision
      ? m.willsAndAgreementsDescriptionOfficialDivision
      : selectedEstate === EstateTypes.permitForUndividedEstate
        ? m.willsAndAgreementsDescriptionDescriptionUndividedEstate
        : m.willsAndAgreementsDescriptionDivisionOfEstateByHeirs
}

export const getEstateMembersDescriptionText = (
  application: Application<FormValue>,
) => {
  const { answers } = application
  const selectedEstate = getValueViaPath(answers, 'selectedEstate') || ''

  return selectedEstate === EstateTypes.estateWithoutAssets
    ? m.estateMembersDescriptionEstateWithoutAssets
    : selectedEstate === EstateTypes.officialDivision
      ? m.estateMembersDescriptionOfficialDivision
      : selectedEstate === EstateTypes.permitForUndividedEstate
        ? m.estateMembersDescriptionUndividedEstate
        : m.estateMembersDescriptionDivisionOfEstateByHeirs
}

export const getEstateDataFromApplication = (
  application: Application<FormValue>,
): { estate?: EstateInfo } => {
  const selectedEstate = application.answers.estateInfoSelection

  let estateData = (
    application.externalData.syslumennOnEntry?.data as {
      estates?: Array<EstateInfo>
    }
  ).estates?.find((estate) => estate.caseNumber === selectedEstate)

  if (!estateData) {
    estateData = (
      application.externalData.syslumennOnEntry?.data as {
        estate: EstateInfo
      }
    ).estate
  }

  return {
    estate: estateData,
  }
}

export const customCurrencyFormat = (input: number | string): string => {
  if (typeof input === 'number') {
    return `${input.toLocaleString('de-DE')} kr.`
  } else if (typeof input === 'string') {
    const decimal = getDecimal(input)

    switch (decimal) {
      case ',':
        return `${Number(input.replace(decimal, '.')).toLocaleString(
          'de-DE',
        )} kr.`
      case '.':
        return `${Number(input).toLocaleString('de-DE')} kr.`
      default:
        break
    }
  }

  return `${input} kr.`
}

const getDecimal = (input: string): false | string => {
  const decimalCount = (input.match(/,/g) || []).length
  const periodCount = (input.match(/\./g) || []).length

  if (decimalCount === 1 && periodCount === 0) {
    return ','
  }

  if (decimalCount === 0 && periodCount === 1) {
    return '.'
  }

  return false
}

export const isValidRealEstate = (value: string) => {
  const lotRegex = /^[Ll]\d{6}$/
  const houseRegex = /^[Ff]\d{7}$/

  return lotRegex.test(value) || houseRegex.test(value)
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
    // Remove all characters except digits, delimiter, and minus sign
    const regex = new RegExp(`[^${delimiter}\\d-]+`, 'g')
    const regex2 = new RegExp(`(?<=\\${delimiter}.*)\\${delimiter}`, 'g')

    // Remove non-numeric characters (preserving minus signs)
    let parsed = value.replace(regex, '').replace(regex2, '')

    // Only preserve minus if it's at the start of the cleaned string
    const hasLeadingMinus = parsed.startsWith('-')
    parsed = parsed.replace(/-/g, '')
    if (hasLeadingMinus && parsed.length > 0) {
      parsed = '-' + parsed
    }

    return parseFloat(parsed.replace(delimiter, '.'))
  }

  return 0
}
