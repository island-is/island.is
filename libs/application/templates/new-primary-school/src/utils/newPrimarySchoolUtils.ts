import {
  NO,
  YES,
  YesOrNo,
  corePendingActionMessages,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  PendingAction,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { info, isValid } from 'kennitala'
import { MessageDescriptor } from 'react-intl'
import {
  differentNeedsMessages,
  pendingActionMessages,
  sharedMessages,
} from '../lib/messages'
import {
  Affiliation,
  Child,
  ChildInformation,
  FileType,
  FriggChildInformation,
  HealthProfileModel,
  Organization,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
  SocialProfile,
  YesOrNoOrEmpty,
} from '../types'
import {
  AgentType,
  ApplicationFeatureConfigType,
  ApplicationType,
  AttachmentOptions,
  CaseWorkerInputTypeEnum,
  FIRST_GRADE_AGE,
  OptionsType,
  OrganizationSector,
  OrganizationSubType,
  PayerOption,
  ReasonForApplicationOptions,
  Roles,
} from './constants'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicationType = getValueViaPath<ApplicationType>(
    answers,
    'applicationType',
  )

  const childNationalId = getValueViaPath<string>(answers, 'childNationalId')

  const childInfo = getValueViaPath<ChildInformation>(answers, 'childInfo')

  const guardians = getValueViaPath<Person[]>(answers, 'guardians') ?? []

  const relatives = getValueViaPath<RelativesRow[]>(answers, 'relatives') ?? []

  const reasonForApplicationIdAndKey =
    getValueViaPath<ReasonForApplicationOptions>(
      answers,
      'reasonForApplication.reason',
    )

  const [reasonForApplicationId, reasonForApplication] =
    reasonForApplicationIdAndKey?.split('::') ?? []

  const counsellingRegardingApplication = getValueViaPath<string>(
    answers,
    'counsellingRegardingApplication.counselling',
  )

  const hasVisitedSchool = getValueViaPath<YesOrNo>(
    answers,
    'counsellingRegardingApplication.hasVisitedSchool',
  )

  const siblings = getValueViaPath<SiblingsRow[]>(answers, 'siblings') ?? []

  const languageEnvironmentIdAndKey = getValueViaPath<string>(
    answers,
    'languages.languageEnvironment',
  )

  const [languageEnvironmentId, languageEnvironment] =
    languageEnvironmentIdAndKey?.split('::') ?? []

  const selectedLanguages =
    getValueViaPath<Array<{ code: string }>>(
      answers,
      'languages.selectedLanguages',
    ) ?? []

  const signLanguage = getValueViaPath<YesOrNo>(
    answers,
    'languages.signLanguage',
  )

  const preferredLanguage = getValueViaPath<string>(
    answers,
    'languages.preferredLanguage',
  )

  const hasFoodAllergiesOrIntolerances =
    getValueViaPath<string[]>(
      answers,
      'healthProtection.hasFoodAllergiesOrIntolerances',
    ) ?? []

  const foodAllergiesOrIntolerances =
    getValueViaPath<string[]>(
      answers,
      'healthProtection.foodAllergiesOrIntolerances',
    ) ?? []

  const hasOtherAllergies =
    getValueViaPath<string[]>(answers, 'healthProtection.hasOtherAllergies') ??
    []

  const otherAllergies =
    getValueViaPath<string[]>(answers, 'healthProtection.otherAllergies') ?? []

  const usesEpiPen = getValueViaPath<YesOrNo>(
    answers,
    'healthProtection.usesEpiPen',
  )

  const hasConfirmedMedicalDiagnoses = getValueViaPath<YesOrNo>(
    answers,
    'healthProtection.hasConfirmedMedicalDiagnoses',
  )

  const requestsMedicationAdministration = getValueViaPath<YesOrNo>(
    answers,
    'healthProtection.requestsMedicationAdministration',
  )

  const hasDiagnoses = getValueViaPath<YesOrNo>(answers, 'support.hasDiagnoses')

  const hasHadSupport = getValueViaPath<YesOrNo>(
    answers,
    'support.hasHadSupport',
  )

  const hasWelfareContact = getValueViaPath<YesOrNo>(
    answers,
    'support.hasWelfareContact',
  )

  const welfareContactName = getValueViaPath<string>(
    answers,
    'support.welfareContact.name',
  )

  const welfareContactEmail = getValueViaPath<string>(
    answers,
    'support.welfareContact.email',
  )

  const hasIntegratedServices = getValueViaPath<YesOrNo>(
    answers,
    'support.hasIntegratedServices',
  )

  const hasCaseManager = getValueViaPath<YesOrNo>(
    answers,
    'support.hasCaseManager',
  )

  const caseManagerName = getValueViaPath<string>(
    answers,
    'support.caseManager.name',
  )

  const caseManagerEmail = getValueViaPath<string>(
    answers,
    'support.caseManager.email',
  )

  const requestingMeeting = getValueViaPath<YesOrNo>(
    answers,
    'support.requestingMeeting[0]',
    NO,
  )

  const specialEducationHasWelfareContact = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasWelfareContact',
  )

  const specialEducationWelfareContactName = getValueViaPath<string>(
    answers,
    'specialEducationSupport.welfareContact.name',
  )

  const specialEducationWelfareContactEmail = getValueViaPath<string>(
    answers,
    'specialEducationSupport.welfareContact.email',
  )

  const specialEducationHasCaseManager = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasCaseManager',
  )

  const specialEducationCaseManagerName = getValueViaPath<string>(
    answers,
    'specialEducationSupport.caseManager.name',
  )

  const specialEducationCaseManagerEmail = getValueViaPath<string>(
    answers,
    'specialEducationSupport.caseManager.email',
  )

  const specialEducationHasIntegratedServices = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasIntegratedServices',
  )

  const hasAssessmentOfSupportNeeds = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasAssessmentOfSupportNeeds',
  )

  const isAssessmentOfSupportNeedsInProgress = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.isAssessmentOfSupportNeedsInProgress',
  )

  const supportNeedsAssessmentBy = getValueViaPath<string>(
    answers,
    'specialEducationSupport.supportNeedsAssessmentBy',
  )

  const hasConfirmedDiagnosis = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasConfirmedDiagnosis',
  )

  const isDiagnosisInProgress = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.isDiagnosisInProgress',
  )

  const diagnosticians =
    getValueViaPath<string[]>(
      answers,
      'specialEducationSupport.diagnosticians',
    ) ?? []

  const hasOtherSpecialists = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasOtherSpecialists',
  )

  const specialists =
    getValueViaPath<string[]>(answers, 'specialEducationSupport.specialists') ??
    []

  const hasReceivedServicesFromMunicipality = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasReceivedServicesFromMunicipality',
  )

  const servicesFromMunicipality =
    getValueViaPath<string[]>(
      answers,
      'specialEducationSupport.servicesFromMunicipality',
    ) ?? []

  const hasReceivedChildAndAdolescentPsychiatryServices =
    getValueViaPath<YesOrNo>(
      answers,
      'specialEducationSupport.hasReceivedChildAndAdolescentPsychiatryServices',
    )

  const isOnWaitlistForServices = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.isOnWaitlistForServices',
  )

  const childAndAdolescentPsychiatryDepartment = getValueViaPath<string>(
    answers,
    'specialEducationSupport.childAndAdolescentPsychiatryDepartment',
  )

  const childAndAdolescentPsychiatryServicesReceived =
    getValueViaPath<string[]>(
      answers,
      'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
    ) ?? []

  const hasBeenReportedToChildProtectiveServices = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.hasBeenReportedToChildProtectiveServices',
  )

  const isCaseOpenWithChildProtectiveServices = getValueViaPath<YesOrNo>(
    answers,
    'specialEducationSupport.isCaseOpenWithChildProtectiveServices',
  )

  const payer = getValueViaPath<PayerOption>(answers, 'payer.option')

  const payerName = getValueViaPath<string>(answers, 'payer.other.name')

  const payerNationalId = getValueViaPath<string>(
    answers,
    'payer.other.nationalId',
  )

  const expectedStartDate = getValueViaPath<string>(
    answers,
    'startingSchool.expectedStartDate',
  )

  const expectedStartDateHiddenInput = getValueViaPath<string>(
    answers,
    'startingSchool.expectedStartDateHiddenInput',
  )

  const temporaryStay = getValueViaPath<YesOrNo>(
    answers,
    'startingSchool.temporaryStay',
    NO,
  )

  const expectedEndDate = getValueViaPath<string>(
    answers,
    'startingSchool.expectedEndDate',
  )

  const schoolMunicipality = getValueViaPath<string>(
    answers,
    'newSchool.municipality',
  )

  const selectedSchoolId = getValueViaPath<string>(answers, 'newSchool.school')

  const alternativeSpecialEducationDepartment =
    getValueViaPath<Array<{ department: string }>>(
      answers,
      'newSchool.alternativeSpecialEducationDepartment',
    ) ?? []

  const currentNurseryMunicipality = getValueViaPath<string>(
    answers,
    'currentNursery.municipality',
  )

  const currentNursery = getValueViaPath<string>(
    answers,
    'currentNursery.nursery',
  )

  const hasCurrentNursery = getValueViaPath<YesOrNo>(
    answers,
    'currentNursery.hasCurrentNursery',
  )

  const applyForPreferredSchool = getValueViaPath<YesOrNo>(
    answers,
    'school.applyForPreferredSchool',
  )

  const currentSchoolId = getValueViaPath<string>(
    answers,
    'currentSchool.school',
  )

  const attachmentsFiles =
    getValueViaPath<FileType[]>(answers, 'attachments.files') ?? []

  const attachmentsAnswer = getValueViaPath<AttachmentOptions>(
    answers,
    'attachments.answer',
  )

  const terms = getValueViaPath<YesOrNo>(answers, 'acceptTerms[0]', NO)

  const fieldInspection = getValueViaPath<YesOrNo>(
    answers,
    'childCircumstances.onSiteObservation[0]',
    NO,
  )

  const additionalDataProvisioning = getValueViaPath<YesOrNo>(
    answers,
    'childCircumstances.onSiteObservationAdditionalInfo[0]',
    NO,
  )

  const outsideSpecialist = getValueViaPath<YesOrNo>(
    answers,
    'childCircumstances.callInExpert[0]',
    NO,
  )

  const childViewOnApplication = getValueViaPath<YesOrNo>(
    answers,
    'childCircumstances.childViews[0]',
    NO,
  )

  return {
    applicationType,
    childNationalId,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationId,
    counsellingRegardingApplication,
    hasVisitedSchool,
    siblings,
    languageEnvironmentId,
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestsMedicationAdministration,
    hasDiagnoses,
    hasHadSupport,
    hasWelfareContact,
    welfareContactName,
    welfareContactEmail,
    hasIntegratedServices,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestingMeeting,
    specialEducationHasWelfareContact,
    specialEducationWelfareContactName,
    specialEducationWelfareContactEmail,
    specialEducationHasCaseManager,
    specialEducationCaseManagerName,
    specialEducationCaseManagerEmail,
    specialEducationHasIntegratedServices,
    hasAssessmentOfSupportNeeds,
    isAssessmentOfSupportNeedsInProgress,
    supportNeedsAssessmentBy,
    hasConfirmedDiagnosis,
    isDiagnosisInProgress,
    diagnosticians,
    hasOtherSpecialists,
    specialists,
    hasReceivedServicesFromMunicipality,
    servicesFromMunicipality,
    hasReceivedChildAndAdolescentPsychiatryServices,
    isOnWaitlistForServices,
    childAndAdolescentPsychiatryDepartment,
    childAndAdolescentPsychiatryServicesReceived,
    hasBeenReportedToChildProtectiveServices,
    isCaseOpenWithChildProtectiveServices,
    payer,
    payerName,
    payerNationalId,
    expectedStartDate,
    expectedStartDateHiddenInput,
    temporaryStay,
    expectedEndDate,
    schoolMunicipality,
    selectedSchoolId,
    alternativeSpecialEducationDepartment,
    currentNurseryMunicipality,
    currentNursery,
    hasCurrentNursery,
    applyForPreferredSchool,
    currentSchoolId,
    attachmentsFiles,
    attachmentsAnswer,
    terms,
    fieldInspection,
    additionalDataProvisioning,
    outsideSpecialist,
    childViewOnApplication,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath<Child[]>(externalData, 'children.data') ?? []

  const applicantName = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
  )

  const applicantNationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )

  const applicantAddress = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  )

  const applicantPostalCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.postalCode',
  )

  const applicantCity = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.city',
  )

  const applicantMunicipalityCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.municipalityCode',
  )

  const applicantitizenshipCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.citizenship.code',
  )

  const userProfileEmail = getValueViaPath<string>(
    externalData,
    'userProfile.data.email',
  )

  const userProfilePhoneNumber = getValueViaPath<string>(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  )

  const childInformation = getValueViaPath<FriggChildInformation>(
    externalData,
    'childInformation.data',
  )

  const childGradeLevel = getValueViaPath<string>(
    externalData,
    'childInformation.data.gradeLevel',
  )

  const primaryOrgId = getValueViaPath<string>(
    externalData,
    'childInformation.data.primaryOrgId',
  )

  const childAffiliations = getValueViaPath<Affiliation[]>(
    externalData,
    'childInformation.data.affiliations',
  )

  const healthProfile = getValueViaPath<HealthProfileModel | null>(
    externalData,
    'childInformation.data.healthProfile',
  )
  const socialProfile = getValueViaPath<SocialProfile | null>(
    externalData,
    'childInformation.data.socialProfile',
  )

  const preferredSchool = getValueViaPath<Organization | null>(
    externalData,
    'preferredSchool.data',
  )

  const schools =
    getValueViaPath<Organization[]>(externalData, 'schools.data') ?? []

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    applicantMunicipalityCode,
    applicantitizenshipCode,
    userProfileEmail,
    userProfilePhoneNumber,
    childInformation,
    childGradeLevel,
    primaryOrgId,
    childAffiliations,
    healthProfile,
    socialProfile,
    preferredSchool,
    schools,
  }
}

export const getSelectedChild = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { childNationalId } = getApplicationAnswers(answers)
  const { children } = getApplicationExternalData(externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childNationalId
  })
  return selectedChild
}

export const getOtherGuardian = (
  answers: FormValue,
  externalData: ExternalData,
): Person | undefined => {
  const selectedChild = getSelectedChild(answers, externalData)
  return selectedChild?.otherParent as Person | undefined
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

export const getCurrentSchoolName = (externalData: ExternalData) => {
  const { primaryOrgId, childAffiliations } =
    getApplicationExternalData(externalData)

  if (!primaryOrgId || !childAffiliations) {
    return undefined
  }

  // Find the school name since we only have primary org id
  return childAffiliations
    .map((affiliation) => affiliation.organization)
    .find((organization) => organization?.id === primaryOrgId)?.name
}

export const getSchoolName = (externalData: ExternalData, schoolId: string) => {
  const { schools } = getApplicationExternalData(externalData)

  if (!schools) {
    return undefined
  }

  // Find the school name since we only have id
  return schools.find((school) => school?.id === schoolId)?.name
}

export const getPreferredSchoolName = (externalData: ExternalData) => {
  const { preferredSchool } = getApplicationExternalData(externalData)

  return preferredSchool?.name
}

export const determineNameFromApplicationAnswers = (
  application: Application,
) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicationType) {
    return sharedMessages.applicationName
  }

  return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
    ? sharedMessages.enrollmentApplicationName
    : applicationType === ApplicationType.CONTINUING_ENROLLMENT
    ? sharedMessages.continuingEnrollmentApplicationName
    : sharedMessages.newPrimarySchoolApplicationName
}

export const formatGender = (genderCode?: string): MessageDescriptor => {
  switch (genderCode) {
    case '1':
    case '3':
      return sharedMessages.male
    case '2':
    case '4':
      return sharedMessages.female
    case '7':
    case '8':
    default:
      return sharedMessages.otherGender
  }
}

export const getGenderMessage = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedChild = getSelectedChild(answers, externalData)
  const gender = formatGender(selectedChild?.genderCode)
  return gender
}

export const getApplicationType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { childNationalId } = getApplicationAnswers(answers)
  const { childInformation } = getApplicationExternalData(externalData)
  const today = new Date()
  const currentYear = today.getFullYear()
  const firstGradeYear = currentYear - FIRST_GRADE_AGE
  const nationalId = childNationalId || ''
  const nationalIdInfo = info(nationalId)
  const yearOfBirth = nationalIdInfo?.birthday?.getFullYear()

  // Enrollment to 1st grade should only be accessable from 1 Feb to 15 Sep each year
  const enrollmentStartDate = new Date(currentYear, 1, 1) // 1 Feb
  const enrollmentEndDate = new Date(currentYear, 8, 15) // 15 Sep

  const isEnrollmentOpen =
    today >= enrollmentStartDate && today <= enrollmentEndDate

  // Needed to test ENROLLMENT_IN_PRIMARY_SCHOOL application on dev
  if (
    (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
    nationalId === '5555555559' // Bína Maack
  ) {
    return ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  }

  if (!isValid(nationalId) || !yearOfBirth) {
    return undefined
  }

  // if the child is a first grader and enrollment is open, set the application type
  // to enrollment in primary school. Otherwise, set the application type to new primary school
  if (yearOfBirth === firstGradeYear) {
    return isEnrollmentOpen
      ? ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
      : ApplicationType.NEW_PRIMARY_SCHOOL
  }

  // if the child is not a first grader and not currently enrolled in a primary
  // school (no data in Frigg), set the application type to new primary school
  if (yearOfBirth !== firstGradeYear && !childInformation?.primaryOrgId) {
    return ApplicationType.NEW_PRIMARY_SCHOOL
  }

  // else the application type should be determined by the applicant
  return undefined
}

export const getGuardianByNationalId = (
  externalData: ExternalData,
  nationalId: string,
) => {
  if (!nationalId) {
    return undefined
  }

  const { childInformation } = getApplicationExternalData(externalData)

  return childInformation?.agents?.find(
    (agent) =>
      agent.nationalId === nationalId && agent.type === AgentType.Guardian,
  )
}

export const hasDefaultFoodAllergiesOrIntolerances = (
  externalData: ExternalData,
) => {
  const { healthProfile } = getApplicationExternalData(externalData)

  return (healthProfile?.foodAllergiesOrIntolerances?.length ?? 0) > 0
    ? YES
    : NO
}

export const hasDefaultAllergies = (externalData: ExternalData) => {
  const { healthProfile } = getApplicationExternalData(externalData)

  return (healthProfile?.allergies?.length ?? 0) > 0 ? YES : NO
}

export const getDefaultSupportCaseworker = (
  externalData: ExternalData,
  type: CaseWorkerInputTypeEnum,
) => {
  const { socialProfile } = getApplicationExternalData(externalData)

  return socialProfile?.caseWorkers?.find(
    (caseWorker) => caseWorker.type === type,
  )
}

export const hasDefaultSupportCaseworker = (
  externalData: ExternalData,
  type: CaseWorkerInputTypeEnum,
): YesOrNoOrEmpty => {
  const { socialProfile } = getApplicationExternalData(externalData)

  // If no child information is available (not registered in Frigg), return an empty string
  if (!socialProfile || !socialProfile?.caseWorkers) {
    return ''
  }

  return getDefaultSupportCaseworker(externalData, type) ? YES : NO
}

export const getDefaultYESNOValue = (
  value: boolean | null | undefined,
): YesOrNoOrEmpty => {
  // If no child information is available (not registered in Frigg), return an empty string
  // else return YES or NO based on the boolean value comming from Frigg
  return value ? YES : value === false ? NO : ''
}

export const getCurrentAndNextGrade = (grade: string): string[] => {
  const gradeNumber = parseInt(grade, 10)

  if (Number.isNaN(gradeNumber)) return []

  const current = grade.padStart(2, '0')
  const next = gradeNumber + 1

  // Only include the next grade if it's within bounds
  return next <= 10 ? [current, next.toString().padStart(2, '0')] : [current]
}

export const getSelectedSchoolData = (
  externalData: ExternalData,
  schoolId: string,
) => {
  const { schools } = getApplicationExternalData(externalData)

  return schools.find((school) => school?.id === schoolId)
}

export const getSelectedSchoolSector = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { selectedSchoolId } = getApplicationAnswers(answers)

  if (!selectedSchoolId) {
    return ''
  }

  return getSelectedSchoolData(externalData, selectedSchoolId)?.sector ?? ''
}

export const getSelectedSchoolSubType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { selectedSchoolId } = getApplicationAnswers(answers)

  if (!selectedSchoolId) {
    return ''
  }

  return getSelectedSchoolData(externalData, selectedSchoolId)?.subType ?? ''
}

export const getSelectedSchoolUnitId = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { selectedSchoolId } = getApplicationAnswers(answers)
  return selectedSchoolId
    ? getSelectedSchoolData(externalData, selectedSchoolId)?.unitId ?? ''
    : ''
}

export const payerApprovalStatePendingAction = (
  _: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.youNeedToReviewDescription,
      content: pendingActionMessages.payerApprovalAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: pendingActionMessages.payerApprovalApplicantDescription,
      displayStatus: 'info',
    }
  }
}

export const otherGuardianApprovalStatePendingAction = (
  _: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.youNeedToReviewDescription,
      content: pendingActionMessages.otherGuardianApprovalAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: pendingActionMessages.otherGuardianApprovalApplicantDescription,
      displayStatus: 'info',
    }
  }
}

export const getSpecialEducationDepartmentsInMunicipality = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { schoolMunicipality } = getApplicationAnswers(answers)
  const { schools, childGradeLevel } = getApplicationExternalData(externalData)

  const specialEducationSubtypes = [
    OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
    OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
  ]

  return schools.filter(
    ({ subType, address, gradeLevels }) =>
      address?.municipalityId === schoolMunicipality &&
      specialEducationSubtypes.includes(subType) &&
      (childGradeLevel
        ? gradeLevels.some((grade) =>
            getCurrentAndNextGrade(childGradeLevel).includes(grade),
          )
        : true),
  )
}

export const getWelfareContactDescription = (application: Application) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
    ? differentNeedsMessages.support.hasWelfareNurserySchoolContactDescription
    : differentNeedsMessages.support.hasWelfarePrimarySchoolContactDescription
}

export const getReasonOptionsType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedSchoolSector = getSelectedSchoolSector(answers, externalData)
  const selectedSchoolSubType = getSelectedSchoolSubType(answers, externalData)

  return selectedSchoolSubType === OrganizationSubType.INTERNATIONAL_SCHOOL
    ? OptionsType.REASON_INTERNATIONAL_SCHOOL
    : selectedSchoolSector === OrganizationSector.PRIVATE
    ? OptionsType.REASON_PRIVATE_SCHOOL
    : OptionsType.REASON
}

export const mapApplicationType = (answers: FormValue) => {
  const { applicationType, applyForPreferredSchool } =
    getApplicationAnswers(answers)

  switch (applicationType) {
    case ApplicationType.NEW_PRIMARY_SCHOOL:
      return ApplicationFeatureConfigType.TRANSFER

    case ApplicationType.CONTINUING_ENROLLMENT:
      return ApplicationFeatureConfigType.CONTINUATION

    case ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL:
      return applyForPreferredSchool === YES
        ? ApplicationFeatureConfigType.ENROLLMENT
        : ApplicationFeatureConfigType.TRANSFER

    default:
      return ApplicationFeatureConfigType.ENROLLMENT
  }
}
