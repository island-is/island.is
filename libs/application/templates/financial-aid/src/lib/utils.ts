import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import {
  ApplicationContext,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions, FAApplication } from '..'
import {
  FamilyStatus,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  Municipality,
} from '@island.is/financial-aid/shared/lib'

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

export function isMuncipalityRegistered(context: ApplicationContext) {
  const { externalData } = context.application

  const municipality = getValueViaPath(
    externalData,
    `nationalRegistry.data.municipality.`,
  ) as Municipality | null
  return municipality != null
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))

export function findFamilyStatus(
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) {
  switch (true) {
    case martialStatusTypeFromMartialCode(
      externalData.nationalRegistry?.data?.applicant?.spouse?.maritalStatus,
    ) === MartialStatusType.MARRIED:
      return FamilyStatus.MARRIED
    case answers?.relationshipStatus?.unregisteredCohabitation ===
      ApproveOptions.Yes:
      return FamilyStatus.UNREGISTERED_COBAHITATION
    default:
      return FamilyStatus.NOT_COHABITATION
  }
}
