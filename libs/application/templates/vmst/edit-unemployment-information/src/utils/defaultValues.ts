import { getValueViaPath, YES, NO } from '@island.is/application/core'
import { ExternalData, Application } from '@island.is/application/types'
import {
  GaldurExternalDomainModelsBankAccountDTO,
  GaldurExternalDomainModelsEducationDTO,
  GaldurExternalDomainModelsApplicantLanguageAbilityDTO,
  GaldurExternalDomainModelsApplicantPreferredJobDTO,
} from '@island.is/clients/vmst-unemployment'
import { getBankLedgerValues } from './getBankLedgerValues'

const APP_PATH = 'currentApplicationInformation.data.currentApplication'

export const getOtherAddressDefault = (application: Application) =>
  getValueViaPath<string>(
    application.externalData,
    `${APP_PATH}.currentAddress`,
  ) ?? ''

export const getCurrentAddressIsNotDifferentDefault = (
  application: Application,
) => {
  const isDifferent =
    getValueViaPath<boolean>(
      application.externalData,
      `${APP_PATH}.currentAddressDifferent`,
    ) ?? false

  return isDifferent ? [] : [YES]
}

export const getOtherPostcodeDefault = (application: Application) =>
  getValueViaPath<string>(
    application.externalData,
    `${APP_PATH}.currentPostCodeId`,
  ) ?? ''

export const getPasswordDefault = (application: Application) =>
  getValueViaPath<string>(application.externalData, `${APP_PATH}.passCode`) ??
  ''

export const getBankAccountDefault = (application: Application) => {
  const bankAccount = getValueViaPath<GaldurExternalDomainModelsBankAccountDTO>(
    application.externalData,
    `${APP_PATH}.bankAccount`,
  )
  const bankLedgerValues = getBankLedgerValues(
    application.externalData,
    bankAccount?.bankId ?? '',
    bankAccount?.ledgerId ?? '',
  )
  return {
    bankNumber: bankLedgerValues.bankId ?? '',
    ledger: bankLedgerValues.ledgerId ?? '',
    accountNumber: bankAccount?.accountNumber ?? '',
  }
}

export const getDefaultJobWishes = (application: Application) => {
  const jobs =
    getValueViaPath<GaldurExternalDomainModelsApplicantPreferredJobDTO[]>(
      application.externalData,
      `${APP_PATH}.preferredJobs`,
    ) ?? []
  return jobs.map((job) => job.jobCodeId ?? '').filter(Boolean)
}

export const getDefaultEducation = (application: Application) => {
  const education =
    getValueViaPath<Array<GaldurExternalDomainModelsEducationDTO>>(
      application.externalData,
      `${APP_PATH}.educationHistory`,
    ) || []
  return education.map((edu) => ({
    levelOfStudy: edu.educationProgramId ?? '',
    degree: edu.educationDegreeId ?? '',
    courseOfStudy: edu.educationSubjectId ?? '',
    endDate: edu.yearFinished?.toString() ?? '',
    readOnly: true,
  }))
}

export const getDefaultHasDrivingLicense = (application: Application) => {
  const defaults = getDefaultDrivingLicenses(application)
  return defaults.length > 0 ? ['yes'] : []
}

export const getDefaultDrivingLicenceTypes = (externalData: ExternalData) =>
  getValueViaPath<string[]>(externalData, `${APP_PATH}.drivingLicenses`) ?? []

export const getDefaultDrivingLicenses = (application: Application) =>
  getDefaultDrivingLicenceTypes(application.externalData)

export const getDefaultHasHeavyMachineryLicense = (
  application: Application,
) => {
  const defaults = getDefaultHeavyMachineryLicenses(application)
  return defaults.length > 0 ? ['yes'] : []
}

export const getDefaultHeavyMachineryLicenceTypes = (
  externalData: ExternalData,
) =>
  getValueViaPath<string[]>(externalData, `${APP_PATH}.workMachineRights`) ?? []

export const getDefaultHeavyMachineryLicenses = (application: Application) =>
  getDefaultHeavyMachineryLicenceTypes(application.externalData)

export const getDefaultLanguages = (application: Application) => {
  const currentLanguages =
    getValueViaPath<GaldurExternalDomainModelsApplicantLanguageAbilityDTO[]>(
      application.externalData,
      `${APP_PATH}.languageAbility`,
    ) ?? []
  return currentLanguages.map((lang) => ({
    language: lang.languageId ?? '',
    skill: lang.abilityId ?? '',
    readOnly: true as const,
  }))
}

export const getDefaultEures = (application: Application) => {
  const saveEURES = getValueViaPath<boolean>(
    application.externalData,
    `${APP_PATH}.saveEURES`,
  )
  return saveEURES ? YES : NO
}
