import {
  EducationHistoryInAnswers,
  EducationType,
  EmploymentStatus,
  PaymentsFromPensionInAnswers,
  WorkingAbility,
} from '../shared'
import { employment as employmentMessages } from '../lib/messages'
import { education as educationMessages } from '../lib/messages'

import { ExternalData, FormText } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  GaldurDomainModelsEducationItem,
  GaldurDomainModelsSettingsIncomeTypesIncomeTypeDTO,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsServiceAreasServiceAreaDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
} from '@island.is/clients/vmst-unemployment'

export const getCurrentSituationString = (
  status: EmploymentStatus,
): FormText => {
  const statusMap: Record<EmploymentStatus, FormText> = {
    [EmploymentStatus.UNEMPLOYED]:
      employmentMessages.currentSituation.labels.statusOptionNoJob,
    [EmploymentStatus.EMPLOYED]:
      employmentMessages.currentSituation.labels.statusCurrentlyEmployed,
    [EmploymentStatus.PARTJOB]:
      employmentMessages.currentSituation.labels.statusPartJob,
    [EmploymentStatus.OCCASIONAL]:
      employmentMessages.currentSituation.labels.statusOccasionalJob,
  }

  return statusMap[status]
}

export const getWorkingAbilityString = (status: WorkingAbility): FormText => {
  const statusMap: Record<WorkingAbility, FormText> = {
    [WorkingAbility.ABLE]:
      employmentMessages.workingAbility.labels.optionFullTime,
    [WorkingAbility.DISABILITY]:
      employmentMessages.workingAbility.labels.optionDisability,
    [WorkingAbility.PARTLY_ABLE]:
      employmentMessages.workingAbility.labels.optionPartTime,
  }

  return statusMap[status]
}

export const getLastTvelveMonthsEducationString = (
  status: EducationType,
): FormText => {
  const statusMap: Record<EducationType, FormText> = {
    [EducationType.CURRENT]: educationMessages.labels.currentlyEducationLabel,
    [EducationType.LAST_SEMESTER]:
      educationMessages.labels.lastSemesterEducationLabel,
    [EducationType.LAST_YEAR]:
      educationMessages.labels.lastTvelveMonthsEducationLabel,
  }

  return statusMap[status]
}

export const getTypeOfPensionPaymentString = (
  id: string,
  externalData: ExternalData,
): string => {
  const pensionFundsOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
  >(externalData, 'unemploymentApplication.data.supportData.pensionFunds', [])

  return pensionFundsOptions?.find((x) => x.id === id)?.name ?? ''
}

export const getUnionString = (
  id: string,
  externalData: ExternalData,
): string => {
  const unionOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsUnionsUnionDTO>
  >(externalData, 'unemploymentApplication.data.supportData.unions', [])

  return unionOptions?.find((x) => x.id === id)?.name ?? ''
}

export const getPrivatePensionString = (
  id: string,
  externalData: ExternalData,
): string => {
  const privatePensionOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
  >(
    externalData,
    'unemploymentApplication.data.supportData.privatePensionFunds',
    [],
  )

  return privatePensionOptions?.find((x) => x.id === id)?.name ?? ''
}

export const getTypeOfIncomeString = (
  payment: PaymentsFromPensionInAnswers,
  externalData: ExternalData,
  locale: string,
): PaymentsFromPensionInAnswers => {
  const incomeOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsIncomeTypesIncomeTypeDTO>
  >(externalData, 'unemploymentApplication.data.supportData.incomeTypes', [])

  const chosenIncomeOption = incomeOptions?.find(
    (x) => x.id === payment.typeOfPayment,
  )

  const optionWithLocale =
    locale === 'is' ? chosenIncomeOption?.name : chosenIncomeOption?.english

  return {
    paymentAmount: payment.paymentAmount,
    typeOfPayment: optionWithLocale ?? '',
  }
}

export const getJobString = (
  id: string,
  externalData: ExternalData,
  locale: string,
): string => {
  const jobList =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      externalData,
      'unemploymentApplication.data.supportData.jobCodes',
    ) ?? []
  const chosenJob = jobList?.find((x) => x.id === id)

  return (
    (locale === 'is'
      ? chosenJob?.name
      : chosenJob?.english ?? chosenJob?.name) || ''
  )
}

export const getLocationString = (
  id: string,
  externalData: ExternalData,
  locale: string,
): string => {
  const locations =
    getValueViaPath<GaldurDomainModelsSettingsServiceAreasServiceAreaDTO[]>(
      externalData,
      'unemploymentApplication.data.supportData.serviceAreas',
    ) || []
  const chosenLocation = locations?.find((x) => x.id === id)

  return (
    (locale === 'is'
      ? chosenLocation?.name
      : chosenLocation?.english ?? chosenLocation?.name) || ''
  )
}

export const getEducationStrings = (
  historyItem: EducationHistoryInAnswers,
  externalData: ExternalData,
  locale: string,
): EducationHistoryInAnswers => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationItem[]>(
      externalData,
      'unemploymentApplication.data.supportData.education',
    ) ?? []

  const educationItemLevel1 = education?.filter(
    (item) => item.level === 1 && item.id === historyItem.levelOfStudy,
  )[0]
  const educationItemLevel2 = education?.filter(
    (item) =>
      item.level === 2 &&
      item.parentId === historyItem.levelOfStudy &&
      item.id === historyItem.degree,
  )[0]

  const degreeString =
    (locale === 'is'
      ? educationItemLevel2?.name
      : educationItemLevel2?.english ?? educationItemLevel2?.name) || ''

  const levelOfStudyString =
    (locale === 'is'
      ? educationItemLevel1?.name
      : educationItemLevel1?.english ?? educationItemLevel1?.name) || ''

  const courseOfStudy = education
    ?.find(
      (level) =>
        level.level === 2 &&
        level.parentId === historyItem.levelOfStudy &&
        level.id === historyItem.degree,
    )
    ?.relations?.find((relation) => relation.code === historyItem.courseOfStudy)

  const courseOfStudyString = courseOfStudy?.name ?? ''
  return {
    ...historyItem,
    degree: degreeString,
    levelOfStudy: levelOfStudyString,
    courseOfStudy: courseOfStudyString,
  }
}
