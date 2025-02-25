import { NO, YesOrNo, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { MessageDescriptor } from 'react-intl'
import {
  Child,
  ChildInformation,
  ContactsRow,
  FriggChildInformation,
  Membership,
  Person,
  SelectOption,
  SiblingsRow,
} from '../types'
import {
  ApplicationType,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
} from './constants'

import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  let applicationType = getValueViaPath(
    answers,
    'applicationType',
  ) as ApplicationType

  if (!applicationType) applicationType = ApplicationType.NEW_PRIMARY_SCHOOL

  const childNationalId = getValueViaPath(answers, 'childNationalId') as string

  const childInfo = getValueViaPath(answers, 'childInfo') as ChildInformation

  const guardians = getValueViaPath(answers, 'guardians') as Person[]

  const contacts = getValueViaPath(answers, 'contacts') as ContactsRow[]

  const reasonForApplication = getValueViaPath(
    answers,
    'reasonForApplication.reason',
  ) as ReasonForApplicationOptions

  const reasonForApplicationStreetAddress = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.streetAddress',
  ) as string

  const reasonForApplicationPostalCode = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.postalCode',
  ) as string

  const siblings = getValueViaPath(answers, 'siblings') as SiblingsRow[]

  const languageEnvironment = getValueViaPath(
    answers,
    'languages.languageEnvironment',
  ) as string

  const selectedLanguages = getValueViaPath(
    answers,
    'languages.selectedLanguages',
  ) as Array<{
    code: string
  }>

  const signLanguage = getValueViaPath(
    answers,
    'languages.signLanguage',
  ) as YesOrNo

  const preferredLanguage = getValueViaPath(
    answers,
    'languages.preferredLanguage',
  ) as string

  const guardianRequiresInterpreter = getValueViaPath(
    answers,
    'languages.guardianRequiresInterpreter',
  ) as YesOrNo

  const acceptFreeSchoolLunch = getValueViaPath(
    answers,
    'freeSchoolMeal.acceptFreeSchoolLunch',
  ) as YesOrNo

  const hasSpecialNeeds = getValueViaPath(
    answers,
    'freeSchoolMeal.hasSpecialNeeds',
  ) as YesOrNo

  const specialNeedsType = getValueViaPath(
    answers,
    'freeSchoolMeal.specialNeedsType',
  ) as string

  const hasFoodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodAllergiesOrIntolerances',
  ) as string[]

  const foodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodAllergiesOrIntolerances',
  ) as string[]

  const hasOtherAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasOtherAllergies',
  ) as string[]

  const otherAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.otherAllergies',
  ) as string[]

  const usesEpiPen = getValueViaPath(
    answers,
    'allergiesAndIntolerances.usesEpiPen',
  ) as YesOrNo

  const hasConfirmedMedicalDiagnoses = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasConfirmedMedicalDiagnoses',
  ) as YesOrNo

  const requestsMedicationAdministration = getValueViaPath(
    answers,
    'allergiesAndIntolerances.requestsMedicationAdministration',
  ) as YesOrNo

  const hasDiagnoses = getValueViaPath(
    answers,
    'support.hasDiagnoses',
  ) as YesOrNo

  const hasHadSupport = getValueViaPath(
    answers,
    'support.hasHadSupport',
  ) as YesOrNo

  const hasIntegratedServices = getValueViaPath(
    answers,
    'support.hasIntegratedServices',
  ) as YesOrNo

  const hasCaseManager = getValueViaPath(
    answers,
    'support.hasCaseManager',
  ) as YesOrNo

  const caseManagerName = getValueViaPath(
    answers,
    'support.caseManager.name',
  ) as string

  const caseManagerEmail = getValueViaPath(
    answers,
    'support.caseManager.email',
  ) as string

  const requestingMeeting = getValueViaPath(
    answers,
    'support.requestingMeeting[0]',
    NO,
  ) as YesOrNo

  const expectedStartDate = getValueViaPath(
    answers,
    'expectedStartDate',
  ) as string

  const schoolMunicipality = getValueViaPath(
    answers,
    'newSchool.municipality',
  ) as string

  const selectedSchool = getValueViaPath(answers, 'newSchool.school') as string

  const currentNurseryMunicipality = getValueViaPath(
    answers,
    'currentNursery.municipality',
  ) as string

  const currentNursery = getValueViaPath(
    answers,
    'currentNursery.nursery',
  ) as string

  const applyForNeighbourhoodSchool = getValueViaPath(
    answers,
    'school.applyForNeighbourhoodSchool',
  ) as YesOrNo

  return {
    applicationType,
    childNationalId,
    childInfo,
    guardians,
    contacts,
    reasonForApplication,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    siblings,
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
    guardianRequiresInterpreter,
    acceptFreeSchoolLunch,
    hasSpecialNeeds,
    specialNeedsType,
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestsMedicationAdministration,
    hasDiagnoses,
    hasHadSupport,
    hasIntegratedServices,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestingMeeting,
    expectedStartDate,
    schoolMunicipality,
    selectedSchool,
    currentNurseryMunicipality,
    currentNursery,
    applyForNeighbourhoodSchool,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath(externalData, 'children.data', []) as Child[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.name',
    '',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
    '',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
    '',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
    '',
  ) as string

  const applicantCity = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.city',
    '',
  ) as string

  const childInformation = getValueViaPath(
    externalData,
    'childInformation.data',
  ) as FriggChildInformation

  const childGradeLevel = getValueViaPath(
    externalData,
    'childInformation.data.gradeLevel',
    '',
  ) as string

  const primaryOrgId = getValueViaPath(
    externalData,
    'childInformation.data.primaryOrgId',
    '',
  ) as string

  const childMemberships = getValueViaPath(
    externalData,
    'childInformation.data.memberships',
    [],
  ) as Membership[]

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    childInformation,
    childGradeLevel,
    primaryOrgId,
    childMemberships,
  }
}

export const getSelectedChild = (application: Application) => {
  const { childNationalId } = getApplicationAnswers(application.answers)
  const { children } = getApplicationExternalData(application.externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childNationalId
  })
  return selectedChild
}

export const getOtherGuardian = (
  application: Application,
): Person | undefined => {
  const selectedChild = getSelectedChild(application)

  return selectedChild?.otherParent as Person | undefined
}

export const hasOtherGuardian = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const otherGuardian = getOtherGuardian({
    answers,
    externalData,
  } as Application)
  return !!otherGuardian
}

export const getSelectedOptionLabel = (
  options: SelectOption[],
  key?: string,
) => {
  if (key === undefined) {
    return undefined
  }

  return options.find((option) => option.value === key)?.label
}

export const formatGrade = (gradeLevel: string, lang: Locale) => {
  let grade = gradeLevel
  if (gradeLevel.startsWith('0')) {
    grade = gradeLevel.substring(1)
  }

  if (lang === 'en') {
    switch (grade) {
      case '1':
        return `${grade}st`
      case '2':
        return `${grade}nd`
      case '3':
        return `${grade}rd`
      default:
        return `${grade}th`
    }
  }
  return grade
}

export const getCurrentSchoolName = (application: Application) => {
  const { primaryOrgId, childMemberships } = getApplicationExternalData(
    application.externalData,
  )

  if (!primaryOrgId || !childMemberships) {
    return undefined
  }

  // Find the school name since we only have primary org id
  return childMemberships
    .map((membership) => membership.organization)
    .find((organization) => organization?.id === primaryOrgId)?.name
}

export const hasForeignLanguages = (answers: FormValue) => {
  const { languageEnvironment } = getApplicationAnswers(answers)

  if (!languageEnvironment) {
    return false
  }

  return languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
}

export const showPreferredLanguageFields = (answers: FormValue) => {
  const { languageEnvironment, selectedLanguages } =
    getApplicationAnswers(answers)

  if (!selectedLanguages) {
    return false
  }

  if (
    languageEnvironment ===
      LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC &&
    selectedLanguages.length >= 1 &&
    selectedLanguages.filter((language) => language.code).length >= 1
  ) {
    return true
  }

  if (
    languageEnvironment === LanguageEnvironmentOptions.ICELANDIC_AND_OTHER &&
    selectedLanguages.length >= 2 &&
    selectedLanguages.filter((language) => language.code).length >= 2
  ) {
    return true
  }

  return false
}

export const getNeighbourhoodSchoolName = (application: Application) => {
  const { primaryOrgId, childMemberships } = getApplicationExternalData(
    application.externalData,
  )

  if (!primaryOrgId || !childMemberships) {
    return undefined
  }

  // This function needs to be improved when Juni is ready with the neighbourhood school data

  // Find the school name since we only have primary org id
  return childMemberships
    .map((membership) => membership.organization)
    .find((organization) => organization?.id === primaryOrgId)?.name
}

export const determineNameFromApplicationAnswers = (
  application: Application,
) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
    ? newPrimarySchoolMessages.shared.enrollmentApplicationName
    : newPrimarySchoolMessages.shared.applicationName
}

export const formatGender = (genderCode?: string): MessageDescriptor => {
  switch (genderCode) {
    case '1':
    case '3':
      return newPrimarySchoolMessages.shared.male
    case '2':
    case '4':
      return newPrimarySchoolMessages.shared.female
    case '7':
    case '8':
    default:
      return newPrimarySchoolMessages.shared.otherGender
  }
}

export const getGenderMessage = (application: Application) => {
  const selectedChild = getSelectedChild(application)
  const gender = formatGender(selectedChild?.genderCode)
  return gender
}
