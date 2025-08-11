import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { SectionRouteEnum } from '../types'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantName = getValueViaPath(answers, 'applicant.name') as string

  const applicantNationalId = getValueViaPath(
    answers,
    'applicant.nationalId',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicant.phonenumber',
  ) as string

  const applicantAddress = getValueViaPath(
    answers,
    'applicant.address',
  ) as string

  const applicantCity = getValueViaPath(answers, 'applicant.city') as string

  const assistance = getValueViaPath(
    answers,
    `${SectionRouteEnum.SELF_EVALUATION}.assistance`,
  )
  const maritalStatus = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_MARITAL_STATUS}.status`,
  )

  const residence = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
  )

  const children = getValueViaPath(
    answers,
    SectionRouteEnum.BACKGROUND_INFO_CHILDREN,
  )

  const icelandicCapability = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY}.capability`,
  )

  const languageSkills = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_LANGUAGE}.language`,
  )

  const employmentStatus = getValueViaPath(
    answers,
    SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT,
  )

  const previousEmployment = getValueViaPath(
    answers,
    SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT,
  )

  const educationLevel = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
  )

  const employmentCapability = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY}.capability`,
  )

  const employmentImportance = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE}.importance`,
  )

  const rehabilitationOrTherapy = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY}.rehabilitationOrTherapy`,
  )

  const biggestIssue = getValueViaPath(
    answers,
    `${SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE}.text`,
  )

  const selfEvaluationBackgroundInfo = {
    assistance,
    maritalStatus,
    residence,
    children,
    icelandicCapability,
    languageSkills,
    employmentStatus,
    previousEmployment,
    educationLevel,
    employmentCapability,
    employmentImportance,
    rehabilitationOrTherapy,
    biggestIssue,
  }

  const capabilityImpairmentData = getValueViaPath(
    answers,
    SectionRouteEnum.CAPABILITY_IMPAIRMENT,
  )
  return {
    applicantName,
    applicantNationalId,
    applicantPhonenumber,
    applicantAddress,
    applicantMunicipality: applicantCity,
    userProfileEmail: getValueViaPath(answers, 'userProfile.email') as string,
    selfEvaluationBackgroundInfo,
    capabilityImpairment: capabilityImpairmentData,
  }
}
