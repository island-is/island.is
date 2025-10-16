import {
  EducationType,
  EmploymentStatus,
  PreviousEducationInAnswers,
  WorkingAbility,
} from '../shared'
import { employment as employmentMessages } from '../lib/messages'
import { education as educationMessages } from '../lib/messages'

import { ExternalData, StaticText } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  GaldurDomainModelsEducationProgramDTO,
  GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO,
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsServiceAreasServiceAreaDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
} from '@island.is/clients/vmst-unemployment'

export const getReasonForJobSearchString = (
  mainReason: string,
  externalData: ExternalData,
  locale: string,
  additionalReason?: string,
): { mainReason: string; additionalReason: string } => {
  const unemploymentReasonCategories =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
    >(
      externalData,
      'unemploymentApplication.data.supportData.unemploymentReasonCategories',
      [],
    ) || []

  const topCategory = unemploymentReasonCategories.find(
    (x) => x.id === mainReason,
  )
  const subCategory = topCategory?.unemploymentReasons?.find(
    (x) => x.id === additionalReason,
  )
  return {
    mainReason:
      locale === 'is' && topCategory?.name
        ? topCategory?.name
        : topCategory?.english || '',
    additionalReason:
      locale === 'is' && subCategory?.name
        ? subCategory?.name
        : subCategory?.english || '',
  }
}

export const getCurrentSituationString = (
  status: EmploymentStatus,
): StaticText => {
  const statusMap: Record<EmploymentStatus, StaticText> = {
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

export const getWorkingAbilityString = (status: WorkingAbility): StaticText => {
  const statusMap: Record<WorkingAbility, StaticText> = {
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
): StaticText => {
  const statusMap: Record<EducationType, StaticText> = {
    [EducationType.CURRENT]: educationMessages.labels.currentlyEducationLabel,
    [EducationType.LAST_SEMESTER]:
      educationMessages.labels.lastSemesterEducationLabel,
    [EducationType.LAST_YEAR]:
      educationMessages.labels.lastTvelveMonthsEducationLabel,
  }

  return statusMap[status]
}

export const getPensionString = (
  id: string,
  externalData: ExternalData,
): string | undefined | null => {
  const pensionFundsOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
  >(externalData, 'unemploymentApplication.data.supportData.pensionFunds', [])

  return pensionFundsOptions?.find((x) => x.id === id)?.name
}

export const getUnionString = (
  id: string,
  externalData: ExternalData,
): string | undefined | null => {
  const unionOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsUnionsUnionDTO>
  >(externalData, 'unemploymentApplication.data.supportData.unions', [])

  return unionOptions?.find((x) => x.id === id)?.name
}

export const getPrivatePensionString = (
  id: string,
  externalData: ExternalData,
): string | undefined | null => {
  const privatePensionOptions = getValueViaPath<
    Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
  >(
    externalData,
    'unemploymentApplication.data.supportData.privatePensionFunds',
    [],
  )

  return privatePensionOptions?.find((x) => x.id === id)?.name
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
  historyItem: PreviousEducationInAnswers,
  externalData: ExternalData,
  locale: string,
): PreviousEducationInAnswers => {
  const education =
    getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
      externalData,
      'unemploymentApplication.data.supportData.educationPrograms',
    ) ?? []

  const educationItemLevel1 = education?.filter(
    (item) => item.id === historyItem.levelOfStudy,
  )[0]
  const educationItemLevel2 = educationItemLevel1?.degrees?.filter(
    (item) => item.id === historyItem.degree,
  )[0]

  const degreeString =
    (locale === 'is'
      ? educationItemLevel2?.name
      : educationItemLevel2?.english ?? educationItemLevel2?.name) || ''

  const levelOfStudyString =
    (locale === 'is'
      ? educationItemLevel1?.name
      : educationItemLevel1?.english ?? educationItemLevel1?.name) || ''

  const courseOfStudy = educationItemLevel2?.subjects?.find(
    (level) => level.id === historyItem.courseOfStudy,
  )

  const courseOfStudyString = courseOfStudy?.name ?? ''
  return {
    ...historyItem,
    degree: degreeString,
    levelOfStudy: levelOfStudyString,
    courseOfStudy: courseOfStudyString,
  }
}
