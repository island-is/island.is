import { NO, YES } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  ApplicationFeatureConfigType,
  ApplicationFeatureKey,
  ApplicationType,
  LanguageEnvironmentOptions,
  OrganizationSubType,
  PayerOption,
} from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherGuardian,
  getSelectedSchoolData,
  getSelectedSchoolSubType,
  getSpecialEducationDepartmentsInMunicipality,
  mapApplicationType,
} from './newPrimarySchoolUtils'

export const isCurrentSchoolRegistered = (externalData: ExternalData) => {
  const { primaryOrgId } = getApplicationExternalData(externalData)
  return !!primaryOrgId
}

export const isWelfareContactSelected = (answers: FormValue): boolean => {
  const { hasDiagnoses, hasHadSupport, hasWelfareContact } =
    getApplicationAnswers(answers)

  return (
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
  )
}

export const hasOtherGuardian = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const otherGuardian = getOtherGuardian(answers, externalData)
  return !!otherGuardian
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

export const showCaseManagerFields = (answers: FormValue) => {
  const { hasCaseManager } = getApplicationAnswers(answers)

  return isWelfareContactSelected(answers) && hasCaseManager === YES
}

export const shouldShowPage = (
  answers: FormValue,
  externalData: ExternalData,
  key: ApplicationFeatureKey,
): boolean => {
  const { selectedSchoolId, currentSchoolId } = getApplicationAnswers(answers)
  const { preferredSchool, primaryOrgId } =
    getApplicationExternalData(externalData)
  const applicationType = mapApplicationType(answers)

  const schoolId =
    applicationType === ApplicationFeatureConfigType.ENROLLMENT
      ? preferredSchool?.id
      : applicationType === ApplicationFeatureConfigType.CONTINUATION
      ? primaryOrgId || currentSchoolId
      : selectedSchoolId

  if (!schoolId) return false

  const schoolSettings = getSelectedSchoolData(externalData, schoolId)?.settings

  if (!schoolSettings) return false

  const applicationConfig = schoolSettings.applicationConfigs?.find(
    (config) => config.applicationType === applicationType,
  )

  if (!applicationConfig?.applicationFeatures) return false

  return applicationConfig.applicationFeatures.some(
    (feature) => feature.key === key,
  )
}

export const hasOtherPayer = (answers: FormValue) => {
  const { payer } = getApplicationAnswers(answers)

  return payer === PayerOption.OTHER
}

export const needsPayerApproval = (application: Application) => {
  return (
    shouldShowPage(
      application.answers,
      application.externalData,
      ApplicationFeatureKey.PAYMENT_INFO,
    ) && hasOtherPayer(application.answers)
  )
}

export const needsOtherGuardianApproval = (application: Application) => {
  return (
    shouldShowPage(
      application.answers,
      application.externalData,
      ApplicationFeatureKey.ADDITIONAL_REQUESTORS,
    ) && hasOtherGuardian(application.answers, application.externalData)
  )
}

export const shouldShowExpectedEndDate = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedSchoolSubType = getSelectedSchoolSubType(answers, externalData)

  if (!selectedSchoolSubType) return false

  return (
    selectedSchoolSubType === OrganizationSubType.INTERNATIONAL_SCHOOL ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL
  )
}

export const hasSpecialEducationSubType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedSchoolSubType = getSelectedSchoolSubType(answers, externalData)

  if (!selectedSchoolSubType) return false

  return (
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL
  )
}

export const shouldShowAlternativeSpecialEducationDepartment = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { schoolMunicipality } = getApplicationAnswers(answers)

  const specialEducationSubtypes = [
    OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
    OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
  ]

  const selectedSchoolSubType = getSelectedSchoolSubType(answers, externalData)

  const specialEducationDepartmentsInMunicipality =
    getSpecialEducationDepartmentsInMunicipality(answers, externalData)

  return (
    !!schoolMunicipality &&
    selectedSchoolSubType !== '' &&
    specialEducationSubtypes.includes(selectedSchoolSubType) &&
    specialEducationDepartmentsInMunicipality.length > 1
  )
}

export const hasSpecialEducationWelfareContact = (answers: FormValue) => {
  const { specialEducationHasWelfareContact } = getApplicationAnswers(answers)

  return specialEducationHasWelfareContact === YES
}

export const hasSpecialEducationCaseManager = (answers: FormValue) => {
  const { specialEducationHasCaseManager } = getApplicationAnswers(answers)

  return specialEducationHasCaseManager === YES
}

export const hasBehaviorSchoolOrDepartmentSubType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedSchoolSubType = getSelectedSchoolSubType(answers, externalData)

  if (!selectedSchoolSubType) return false

  return (
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT ||
    selectedSchoolSubType ===
      OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL
  )
}

export const shouldShowSupportNeedsAssessmentBy = (answers: FormValue) => {
  const { hasAssessmentOfSupportNeeds, isAssessmentOfSupportNeedsInProgress } =
    getApplicationAnswers(answers)

  return (
    hasAssessmentOfSupportNeeds === YES ||
    (hasAssessmentOfSupportNeeds === NO &&
      isAssessmentOfSupportNeedsInProgress === YES)
  )
}

export const shouldShowDiagnosticians = (answers: FormValue) => {
  const { hasConfirmedDiagnosis, isDiagnosisInProgress } =
    getApplicationAnswers(answers)

  return (
    hasConfirmedDiagnosis === YES ||
    (hasConfirmedDiagnosis === NO && isDiagnosisInProgress === YES)
  )
}

export const shouldShowSpecialists = (answers: FormValue) => {
  const { hasOtherSpecialists } = getApplicationAnswers(answers)

  return hasOtherSpecialists === YES
}

export const shouldShowServicesFromMunicipality = (answers: FormValue) => {
  const { hasReceivedServicesFromMunicipality } = getApplicationAnswers(answers)

  return hasReceivedServicesFromMunicipality === YES
}

export const shouldShowChildAndAdolescentPsychiatryDepartment = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const {
    hasReceivedChildAndAdolescentPsychiatryServices,
    isOnWaitlistForServices,
  } = getApplicationAnswers(answers)

  return (
    hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
    (hasReceivedChildAndAdolescentPsychiatryServices === YES ||
      (hasReceivedChildAndAdolescentPsychiatryServices === NO &&
        isOnWaitlistForServices === YES))
  )
}

export const shouldShowChildAndAdolescentPsychiatryServicesReceived = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { hasReceivedChildAndAdolescentPsychiatryServices } =
    getApplicationAnswers(answers)

  return (
    hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
    hasReceivedChildAndAdolescentPsychiatryServices === YES
  )
}

export const shouldShowReasonForApplicationPage = (answers: FormValue) => {
  const { applyForPreferredSchool, applicationType } =
    getApplicationAnswers(answers)

  return (
    applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
    (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
      applyForPreferredSchool === NO)
  )
}
