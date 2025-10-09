import { NO, YES, YesOrNo, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { info, isValid } from 'kennitala'
import { MessageDescriptor } from 'react-intl'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  Affiliation,
  Child,
  ChildInformation,
  FriggChildInformation,
  HealthProfileModel,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
  SocialProfile,
  YesOrNoOrEmpty,
} from '../types'
import {
  AffiliationRole,
  ApplicationType,
  CaseWorkerInputTypeEnum,
  FIRST_GRADE_AGE,
  ReasonForApplicationOptions,
  SchoolType,
} from './constants'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

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

  const reasonForApplicationStreetAddress = getValueViaPath<string>(
    answers,
    'reasonForApplication.transferOfLegalDomicile.streetAddress',
  )

  const reasonForApplicationPostalCode = getValueViaPath<string>(
    answers,
    'reasonForApplication.transferOfLegalDomicile.postalCode',
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

  const selectedSchoolIdAndType = getValueViaPath<string>(
    answers,
    'newSchool.school',
  )

  // School type is piggybacked on the value like 'id::type'
  const selectedSchool = selectedSchoolIdAndType
    ? selectedSchoolIdAndType.split('::')[0]
    : ''

  const selectedSchoolType = getValueViaPath<SchoolType>(
    answers,
    'newSchool.type',
  )

  const currentNurseryMunicipality = getValueViaPath<string>(
    answers,
    'currentNursery.municipality',
  )

  const currentNursery = getValueViaPath<string>(
    answers,
    'currentNursery.nursery',
  )

  const applyForNeighbourhoodSchool = getValueViaPath<YesOrNo>(
    answers,
    'school.applyForNeighbourhoodSchool',
  )

  const currentSchoolId = getValueViaPath<string>(
    answers,
    'currentSchool.school',
  )

  return {
    applicationType,
    childNationalId,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationId,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
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
    expectedStartDate,
    expectedStartDateHiddenInput,
    temporaryStay,
    expectedEndDate,
    schoolMunicipality,
    selectedSchool,
    selectedSchoolType,
    currentNurseryMunicipality,
    currentNursery,
    applyForNeighbourhoodSchool,
    currentSchoolId,
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

export const getNeighbourhoodSchoolName = (externalData: ExternalData) => {
  const { primaryOrgId, childAffiliations } =
    getApplicationExternalData(externalData)

  if (!primaryOrgId || !childAffiliations) {
    return undefined
  }

  // This function needs to be improved when Juni is ready with the neighbourhood school data

  // Find the school name since we only have primary org id
  return childAffiliations
    .map((affiliation) => affiliation.organization)
    .find((organization) => organization?.id === primaryOrgId)?.name
}

export const determineNameFromApplicationAnswers = (
  application: Application,
) => {
  const { applicationType } = getApplicationAnswers(application.answers)

  if (!applicationType) {
    return newPrimarySchoolMessages.shared.applicationName
  }

  return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
    ? newPrimarySchoolMessages.shared.enrollmentApplicationName
    : newPrimarySchoolMessages.shared.newPrimarySchoolApplicationName
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

export const getGenderMessage = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedChild = getSelectedChild(answers, externalData)
  const gender = formatGender(selectedChild?.genderCode)
  return gender
}

/*
 This function is used to get the municipality code based on the school unit id for private owned shcools.
 This should be removed when Frigg starts to return the private owned in the same way as the public schools, under the municipality.
*/
export const getMunicipalityCodeBySchoolUnitId = (schoolUnitId: string) => {
  const municipalities = [
    {
      // Kopavogur
      municipalityCode: '1000',
      schools: [
        'G-2297-A', // Arnarskóli
        'G-2396-A', // Waldorfskólinn Lækjarbotnum
      ],
    },
    {
      // Hafnarfjordur
      municipalityCode: '1400',
      schools: [
        'G-2235-A', // Barnaskóli Hjallastefnunnar
        'G-2236-A', // NÚ - Framsýn menntun
      ],
    },
    {
      // Reykjavik
      municipalityCode: '0000',
      schools: [
        'G-1170-A', // Barnaskóli Hjallastefnunnar
        'G-1425-A', // Waldorfskólinn Sólstafir
        'G-1157-B', // Landakotsskóli - Grunnskólastig-IBprogram
        'G-1157-A', // Landakotsskóli - Grunnskólastig-íslenskubraut
        'G-1189-A', // Tjarnarskóli
        'G-1249-A', // Skóli Ísaks Jónssonar
      ],
    },
    {
      // Gardabaer
      municipalityCode: '1300',
      schools: [
        'G-2247-A', // Barnaskóli Hjallastefnunnar
        'G-2250-B', // Alþjóðaskólinn á Íslandi - Bilingual-program
        'G-2250-A', // Alþjóðaskólinn á Íslandi - IB-program
      ],
    },
    {
      // Akureyri
      municipalityCode: '6000',
      schools: [
        'G-5120-A', // Ásgarður - skóli í skýjunum
      ],
    },
  ]

  const municipalityCode = municipalities.find((municipality) =>
    municipality.schools.includes(schoolUnitId),
  )?.municipalityCode

  return municipalityCode
}

export const getInternationalSchoolsIds = () => {
  // Since the data from Frigg is not structured for international schools, we need to manually identify them
  return ['G-2250-A', 'G-2250-B', 'G-1157-A', 'G-1157-B'] //Alþjóðaskólinn G-2250-x & Landkotsskóli G-1157-x
}

export const getApplicationType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { childNationalId } = getApplicationAnswers(answers)
  const { childInformation } = getApplicationExternalData(externalData)

  const currentYear = new Date().getFullYear()
  const firstGradeYear = currentYear - FIRST_GRADE_AGE
  const nationalId = childNationalId || ''

  if (!isValid(nationalId)) {
    return ApplicationType.NEW_PRIMARY_SCHOOL
  }

  const nationalIdInfo = info(nationalId)
  const yearOfBirth = nationalIdInfo?.birthday?.getFullYear()

  if (!yearOfBirth) {
    return ApplicationType.NEW_PRIMARY_SCHOOL
  }

  // If there is no data in Frigg about the child, we need to determine the application type based on the year of birth
  // REMOVE THIS WHEN ENROLLMENT_IN_PRIMARY_SCHOOL GOES LIVE
  if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
    if (!childInformation?.primaryOrgId) {
      return yearOfBirth === firstGradeYear
        ? ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
        : ApplicationType.NEW_PRIMARY_SCHOOL
    }
  }

  return ApplicationType.NEW_PRIMARY_SCHOOL
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
      agent.nationalId === nationalId &&
      agent.type === AffiliationRole.Guardian,
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
