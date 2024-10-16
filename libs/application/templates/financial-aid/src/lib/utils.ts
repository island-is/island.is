import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformation,
  ApplicationContext,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  FamilyStatus,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  Municipality,
} from '@island.is/financial-aid/shared/lib'
import { ApproveOptions, CurrentApplication, UploadFileType } from '..'
import { UploadFile } from '@island.is/island-ui/core'
import { ApplicationStates } from './constants'
import sortBy from 'lodash/sortBy'
import * as m from '../lib/messages'
import { AnswersSchema } from './dataSchema'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)
export const isValidPhone = (value: string) => {
  const phone = parsePhoneNumberFromString(value, 'IS')
  return Boolean(phone && phone.isValid())
}
export const isValidNationalId = (value: string) => kennitala.isValid(value)

export function hasSpouseCheck(context: ApplicationContext) {
  const { externalData, answers } = context.application
  return hasSpouse(answers, externalData)
}

export function isMunicipalityNotRegistered(context: ApplicationContext) {
  const { externalData } = context.application

  const municipality = getValueViaPath<Municipality>(
    externalData,
    `municipality.data`,
  )
  return municipality == null || !municipality.active
}

export const encodeFilenames = (filename: string) =>
  filename && encodeURI(filename.normalize().replace(/ +/g, '_'))

export function findFamilyStatus(
  answers: FormValue,
  externalData: ExternalData,
) {
  const maritalStatus = getValueViaPath<string>(
    externalData,
    'nationalRegistrySpouse.data.maritalStatus',
  )
  const unregisteredCohabitation = getValueViaPath<string>(
    answers,
    'relationshipStatus.unregisteredCohabitation',
  )

  if (
    martialStatusTypeFromMartialCode(maritalStatus) ===
    MartialStatusType.MARRIED
  ) {
    return FamilyStatus.MARRIED
  }

  if (externalData.nationalRegistrySpouse.data != null) {
    return FamilyStatus.COHABITATION
  }

  if (unregisteredCohabitation === ApproveOptions.Yes) {
    return FamilyStatus.UNREGISTERED_COBAHITATION
  }

  return FamilyStatus.NOT_COHABITATION
}

export function hasActiveCurrentApplication(context: ApplicationContext) {
  const { externalData } = context.application
  const currentApplication = getValueViaPath<CurrentApplication>(
    externalData,
    'currentApplication.data',
  )

  return currentApplication?.currentApplicationId != null
}

export const hasFiles = (fileType: UploadFileType, answers: AnswersSchema) => {
  const files = answers[fileType as keyof AnswersSchema] as UploadFile[]
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

export const hasSpouse = (answers: FormValue, externalData: ExternalData) => {
  const nationalRegistrySpouse = externalData.nationalRegistrySpouse.data

  const unregisteredCohabitation = getValueViaPath<string>(
    answers,
    'relationshipStatus.unregisteredCohabitation',
  )

  return (
    Boolean(nationalRegistrySpouse) ||
    unregisteredCohabitation === ApproveOptions.Yes
  )
}

export const getNextStepsDescription = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const applicantHasSpouse = hasSpouse(answers, externalData)
  const missingIncomeFiles =
    answers.income === ApproveOptions.Yes &&
    !hasFiles('incomeFiles', answers as unknown as AnswersSchema)

  if (applicantHasSpouse && missingIncomeFiles) {
    return m.confirmation.nextSteps.contentBothMissingFiles
  } else if (applicantHasSpouse) {
    return m.confirmation.nextSteps.contentSpouseMissingFiles
  } else if (missingIncomeFiles) {
    return m.confirmation.nextSteps.contentMissingFiles
  }

  return ''
}

export const getSpouseNextStepsDescription = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const incomeFiles = hasSpouseIncomeFiles(answers)

  return incomeFiles ? '' : m.confirmation.nextSteps.contentMissingFiles
}

type File = {
  name: string
  key: string
}

export const hasIncomeFiles = (formValue: FormValue) => {
  const income = formValue.income === ApproveOptions.Yes
  const incomeFiles = formValue.incomeFiles as Array<File>

  return income && incomeFiles && incomeFiles.length > 0
}

export const hasSpouseIncomeFiles = (formValue: FormValue) => {
  const income = formValue.spouseIncomeFiles as Array<File>

  return income && income.length > 0
}
