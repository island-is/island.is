import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformation,
  ApplicationContext,
} from '@island.is/application/types'

import {
  FamilyStatus,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  Municipality,
} from '@island.is/financial-aid/shared/lib'

import {
  ApproveOptions,
  CurrentApplication,
  FAApplication,
  OverrideAnswerSchema,
  UploadFileType,
} from '..'
import { UploadFileDeprecated } from '@island.is/island-ui/core'
import { ApplicationStates } from './constants'
import sortBy from 'lodash/sortBy'
import { EMAIL_REGEX } from '@island.is/application/core'

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
export const isValidNationalId = (value: string) => kennitala.isValid(value)

export const hasSpouseCheck = (context: ApplicationContext) => {
  const { externalData, answers } =
    context.application as unknown as FAApplication
  return hasSpouse(answers, externalData)
}

export const hasSpouse = (
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) => {
  const nationalRegistrySpouse = externalData.nationalRegistrySpouse.data

  const unregisteredCohabitation =
    answers?.relationshipStatus?.unregisteredCohabitation

  return (
    Boolean(nationalRegistrySpouse) ||
    unregisteredCohabitation === ApproveOptions.Yes
  )
}

export const isMuncipalityNotRegistered = (context: ApplicationContext) => {
  const { externalData } = context.application

  const municipality = getValueViaPath(
    externalData,
    `municipality.data`,
  ) as Municipality | null
  return municipality == null || !municipality.active
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))

export const findFamilyStatus = (
  answers: FAApplication['answers'],
  externalData: FAApplication['externalData'],
) => {
  switch (true) {
    case martialStatusTypeFromMartialCode(
      externalData.nationalRegistrySpouse.data?.maritalStatus,
    ) === MartialStatusType.MARRIED:
      return FamilyStatus.MARRIED
    case externalData.nationalRegistrySpouse.data != null:
      return FamilyStatus.COHABITATION
    case answers?.relationshipStatus?.unregisteredCohabitation ===
      ApproveOptions.Yes:
      return FamilyStatus.UNREGISTERED_COBAHITATION
    default:
      return FamilyStatus.NOT_COHABITATION
  }
}

export const hasActiveCurrentApplication = (context: ApplicationContext) => {
  const { externalData } = context.application
  const currentApplication = getValueViaPath(
    externalData,
    'currentApplication.data',
  ) as CurrentApplication

  return currentApplication?.currentApplicationId != null
}

export const hasFiles = (
  fileType: UploadFileType,
  answers: OverrideAnswerSchema,
) => {
  const files = answers[
    fileType as keyof OverrideAnswerSchema
  ] as UploadFileDeprecated[]
  return files && files.length > 0
}

export const waitingForSpouse = (state: string) => {
  return (
    state === ApplicationStates.SPOUSE ||
    state === ApplicationStates.PREREQUISITESSPOUSE
  )
}

export const sortChildrenUnderAgeByAge = (
  children: ApplicantChildCustodyInformation[],
): ApplicantChildCustodyInformation[] => {
  const childrenUnderAge = children.filter(
    (child) => kennitala.info(child.nationalId)?.age < 18,
  )
  return sortBy(childrenUnderAge, (child) => {
    return kennitala.info(child.nationalId)?.birthday
  })
}
