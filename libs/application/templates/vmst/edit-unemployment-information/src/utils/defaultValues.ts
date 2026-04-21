import { getValueViaPath, YES, NO } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import {
  GaldurExternalDomainModelsBankAccountDTO,
  GaldurExternalDomainModelsEducationDTO,
  GaldurExternalDomainModelsApplicantLanguageAbilityDTO,
  GaldurExternalDomainModelsApplicantPreferredJobDTO,
} from '@island.is/clients/vmst-unemployment'
import { getBankLedgerValues } from './getBankLedgerValues'

const APP_PATH = 'currentApplicationInformation.data.currentApplication'

export const getOtherAddressDefault = (externalData: ExternalData) =>
  getValueViaPath<string>(externalData, `${APP_PATH}.currentAddress`) ?? ''

export const getOtherPostcodeDefault = (externalData: ExternalData) =>
  getValueViaPath<string>(externalData, `${APP_PATH}.currentPostCodeId`) ?? ''

export const getPasswordDefault = (externalData: ExternalData) =>
  getValueViaPath<string>(externalData, `${APP_PATH}.passCode`) ?? ''

export const getBankAccountDefault = (externalData: ExternalData) => {
  const bankAccount = getValueViaPath<GaldurExternalDomainModelsBankAccountDTO>(
    externalData,
    `${APP_PATH}.bankAccount`,
  )
  const bankLedgerValues = getBankLedgerValues(
    externalData,
    bankAccount?.bankId ?? '',
    bankAccount?.ledgerId ?? '',
  )
  return {
    bankNumber: bankLedgerValues.bankId ?? '',
    ledger: bankLedgerValues.ledgerId ?? '',
    accountNumber: bankAccount?.accountNumber ?? '',
  }
}

export const getDefaultJobWishes = (externalData: ExternalData) => {
  const jobs =
    getValueViaPath<GaldurExternalDomainModelsApplicantPreferredJobDTO[]>(
      externalData,
      `${APP_PATH}.preferredJobs`,
    ) ?? []
  return jobs.map((job) => job.jobCodeId ?? '').filter(Boolean)
}

export const getDefaultEducation = (externalData: ExternalData) => {
  const education =
    getValueViaPath<Array<GaldurExternalDomainModelsEducationDTO>>(
      externalData,
      `${APP_PATH}.educationHistory`,
    ) || []
  return education.map((edu) => ({
    levelOfStudy: edu.educationProgramId ?? '',
    degree: edu.educationDegreeId ?? '',
    courseOfStudy: edu.educationSubjectId ?? '',
    endDate: edu.yearFinished?.toString() ?? '',
    readOnly: true as const,
  }))
}

export const getDefaultDrivingLicenses = (externalData: ExternalData) =>
  getValueViaPath<string[]>(externalData, `${APP_PATH}.drivingLicenses`) ?? []

export const getDefaultLanguages = (externalData: ExternalData) => {
  const currentLanguages =
    getValueViaPath<GaldurExternalDomainModelsApplicantLanguageAbilityDTO[]>(
      externalData,
      `${APP_PATH}.languageAbility`,
    ) ?? []
  return currentLanguages.map((lang) => ({
    language: lang.languageId ?? '',
    skill: lang.abilityId ?? '',
    readOnly: true as const,
  }))
}

export const getDefaultEures = (externalData: ExternalData) => {
  const saveEURES = getValueViaPath<boolean>(
    externalData,
    `${APP_PATH}.saveEURES`,
  )
  return saveEURES ? YES : NO
}
