import { Application, FormValue } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'

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
): { estate?: EstateInfo } => {
  const selectedEstate = application.answers.estateInfoSelection

  let estateData = (
    application.externalData.syslumennOnEntry?.data as {
      estates?: Array<EstateInfo>
    }
  ).estates?.find((estate) => estate.caseNumber === selectedEstate)

  // TODO: remove singular estate property when legacy applications
  //       have cleared out of the system
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

