import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import {
  Application,
  ApplicationContext,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions, CurrentApplication, FAApplication, Spouse } from '..'

const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
export const isValidNationalId = (value: string) => kennitala.isValid(value)

export function hasSpouseCheck(context: ApplicationContext) {
  const {
    externalData,
    answers,
  } = (context.application as unknown) as FAApplication
  return hasSpouse(answers, externalData)
}

export const hasSpouse = (
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) => {
  const nationalRegistrySpouse =
    externalData.nationalRegistry?.data?.applicant?.spouse

  const unregisteredCohabitation =
    answers?.relationshipStatus?.unregisteredCohabitation

  return (
    Boolean(nationalRegistrySpouse) ||
    unregisteredCohabitation === ApproveOptions.Yes
  )
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))

export function hasActiveCurrentApplication(context: ApplicationContext) {
  const { externalData } = context.application
  const dataProvider = getValueViaPath(
    externalData,
    'veita.data',
  ) as CurrentApplication
  return !dataProvider.currentApplicationId
}
