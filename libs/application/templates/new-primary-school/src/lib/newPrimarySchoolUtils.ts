import { NO, YesOrNo, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { MessageDescriptor } from 'react-intl'
import {
  Affiliation,
  Child,
  ChildInformation,
  FriggChildInformation,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
} from '../types'
import {
  ApplicationType,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
  SchoolType,
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

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  const reasonForApplicationIdAndKey = getValueViaPath(
    answers,
    'reasonForApplication.reason',
  ) as ReasonForApplicationOptions

  const [reasonForApplicationId, reasonForApplication] =
    reasonForApplicationIdAndKey?.split('::') ?? []

  const reasonForApplicationStreetAddress = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.streetAddress',
  ) as string

  const reasonForApplicationPostalCode = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.postalCode',
  ) as string

  const siblings = getValueViaPath(answers, 'siblings') as SiblingsRow[]

  const languageEnvironmentIdAndKey = getValueViaPath(
    answers,
    'languages.languageEnvironment',
  ) as string

  const [languageEnvironmentId, languageEnvironment] =
    languageEnvironmentIdAndKey?.split('::') ?? []

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

  const hasFoodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'healthProtection.hasFoodAllergiesOrIntolerances',
  ) as string[]

  const foodAllergiesOrIntolerances = getValueViaPath(
    answers,
    'healthProtection.foodAllergiesOrIntolerances',
  ) as string[]

  const hasOtherAllergies = getValueViaPath(
    answers,
    'healthProtection.hasOtherAllergies',
  ) as string[]

  const otherAllergies = getValueViaPath(
    answers,
    'healthProtection.otherAllergies',
  ) as string[]

  const usesEpiPen = getValueViaPath(
    answers,
    'healthProtection.usesEpiPen',
  ) as YesOrNo

  const hasConfirmedMedicalDiagnoses = getValueViaPath(
    answers,
    'healthProtection.hasConfirmedMedicalDiagnoses',
  ) as YesOrNo

  const requestsMedicationAdministration = getValueViaPath(
    answers,
    'healthProtection.requestsMedicationAdministration',
  ) as YesOrNo

  const hasDiagnoses = getValueViaPath(
    answers,
    'support.hasDiagnoses',
  ) as YesOrNo

  const hasHadSupport = getValueViaPath(
    answers,
    'support.hasHadSupport',
  ) as YesOrNo

  const hasWelfareContact = getValueViaPath(
    answers,
    'support.hasWelfareContact',
  ) as YesOrNo

  const welfareContactName = getValueViaPath<string>(
    answers,
    'support.welfareContact.name',
  )

  const welfareContactEmail = getValueViaPath<string>(
    answers,
    'support.welfareContact.email',
  )

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
    'startingSchool.expectedStartDate',
  ) as string

  const expectedStartDateHiddenInput = getValueViaPath(
    answers,
    'startingSchool.expectedStartDateHiddenInput',
  )

  const temporaryStay = getValueViaPath(
    answers,
    'startingSchool.temporaryStay',
    NO,
  ) as YesOrNo

  const expectedEndDate = getValueViaPath(
    answers,
    'startingSchool.expectedEndDate',
  ) as string

  const schoolMunicipality = getValueViaPath(
    answers,
    'newSchool.municipality',
  ) as string

  const selectedSchoolIdAndType = getValueViaPath(
    answers,
    'newSchool.school',
  ) as string

  // School type is piggybacked on the value like 'id::type'
  const selectedSchool = selectedSchoolIdAndType
    ? selectedSchoolIdAndType.split('::')[0]
    : ''

  const selectedSchoolType = getValueViaPath(
    answers,
    'newSchool.type',
  ) as SchoolType

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

  const applicantMunicipalityCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.municipalityCode',
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

  const childAffiliations = getValueViaPath(
    externalData,
    'childInformation.data.affiliations',
    [],
  ) as Affiliation[]

  const childCitizenshipCode = getValueViaPath<string>(
    externalData,
    'citizenship.data.childCitizenshipCode',
  )

  const otherGuardianCitizenshipCode = getValueViaPath<string>(
    externalData,
    'citizenship.data.otherGuardianCitizenshipCode',
  )

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    applicantMunicipalityCode,
    childInformation,
    childGradeLevel,
    primaryOrgId,
    childAffiliations,
    childCitizenshipCode,
    otherGuardianCitizenshipCode,
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
  const { primaryOrgId, childAffiliations } = getApplicationExternalData(
    application.externalData,
  )

  if (!primaryOrgId || !childAffiliations) {
    return undefined
  }

  // Find the school name since we only have primary org id
  return childAffiliations
    .map((affiliation) => affiliation.organization)
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
  const { primaryOrgId, childAffiliations } = getApplicationExternalData(
    application.externalData,
  )

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
