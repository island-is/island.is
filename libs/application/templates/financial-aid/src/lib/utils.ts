import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { ApplicationContext } from '@island.is/application/core'
import { ApproveOptions, FAApplication } from '..'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
export const isValidNationalId = (value: string) => kennitala.isValid(value)

export function hasSpouse(context: ApplicationContext) {
  const {
    externalData,
    answers,
  } = (context.application as unknown) as FAApplication

  return (
    Boolean(externalData.nationalRegistry?.data?.applicant?.spouse) ||
    answers.relationshipStatus.unregisteredCohabitation === ApproveOptions.Yes
  )
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))
