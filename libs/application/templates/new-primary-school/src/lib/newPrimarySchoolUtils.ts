import { NO, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  YesOrNo,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import {
  Child,
  ChildInformation,
  FriggChildInformation,
  Membership,
  Parents,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
} from '../types'
import {
  ReasonForApplicationOptions,
  SiblingRelationOptions,
} from './constants'
import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childNationalId = getValueViaPath(answers, 'childNationalId') as string

  const childInfo = getValueViaPath(answers, 'childInfo') as ChildInformation

  const differentPlaceOfResidence = getValueViaPath(
    answers,
    'childInfo.differentPlaceOfResidence',
  ) as YesOrNo

  const parents = getValueViaPath(answers, 'parents') as Parents

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  const reasonForApplication = getValueViaPath(
    answers,
    'reasonForApplication.reason',
  ) as ReasonForApplicationOptions

  const reasonForApplicationCountry = getValueViaPath(
    answers,
    'reasonForApplication.movingAbroad.country',
  ) as string

  const reasonForApplicationStreetAddress = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.streetAddress',
  ) as string

  const reasonForApplicationPostalCode = getValueViaPath(
    answers,
    'reasonForApplication.transferOfLegalDomicile.postalCode',
  ) as string

  const siblings = getValueViaPath(answers, 'siblings') as SiblingsRow[]

  const nativeLanguage = getValueViaPath(
    answers,
    'languages.nativeLanguage',
  ) as string

  const otherLanguagesSpokenDaily = getValueViaPath(
    answers,
    'languages.otherLanguagesSpokenDaily',
  ) as YesOrNo

  const otherLanguages = getValueViaPath(
    answers,
    'languages.otherLanguages',
  ) as string[]

  const icelandicNotSpokenAroundChild = getValueViaPath(
    answers,
    'languages.icelandicNotSpokenAroundChild',
  ) as string[]

  const developmentalAssessment = getValueViaPath(
    answers,
    'support.developmentalAssessment',
  ) as YesOrNo

  const specialSupport = getValueViaPath(
    answers,
    'support.specialSupport',
  ) as YesOrNo

  const requestMeeting = getValueViaPath(
    answers,
    'support.requestMeeting[0]',
    NO,
  ) as YesOrNo

  const startDate = getValueViaPath(answers, 'startDate') as string

  const schoolMunicipality = getValueViaPath(
    answers,
    'schools.newSchool.municipality',
  ) as string

  const selectedSchool = getValueViaPath(
    answers,
    'schools.newSchool.school',
  ) as string

  const newSchoolHiddenInput = getValueViaPath(
    answers,
    'schools.newSchool.hiddenInput',
  ) as string

  return {
    childNationalId,
    childInfo,
    differentPlaceOfResidence,
    parents,
    relatives,
    reasonForApplication,
    reasonForApplicationCountry,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    siblings,
    nativeLanguage,
    otherLanguagesSpokenDaily,
    otherLanguages,
    icelandicNotSpokenAroundChild,
    developmentalAssessment,
    specialSupport,
    requestMeeting,
    startDate,
    schoolMunicipality,
    selectedSchool,
    newSchoolHiddenInput,
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

export const getOtherParent = (
  application: Application,
): Person | undefined => {
  const selectedChild = getSelectedChild(application)

  return selectedChild?.otherParent as Person | undefined
}

export const hasOtherParent = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const otherParent = getOtherParent({ answers, externalData } as Application)
  return !!otherParent
}

export const getReasonForApplicationOptions = () => [
  {
    value: ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE,
    label: newPrimarySchoolMessages.primarySchool.transferOfLegalDomicile,
  },
  {
    value: ReasonForApplicationOptions.STUDY_STAY_FOR_PARENTS,
    label: newPrimarySchoolMessages.primarySchool.studyStayForParents,
  },
  {
    value: ReasonForApplicationOptions.PARENTS_PARLIAMENTARY_MEMBERSHIP,
    label:
      newPrimarySchoolMessages.primarySchool.parentsParliamentaryMembership,
  },
  {
    value: ReasonForApplicationOptions.TEMPORARY_FROSTER,
    label: newPrimarySchoolMessages.primarySchool.temporaryFoster,
  },
  {
    value: ReasonForApplicationOptions.EXPERT_SERVICE,
    label: newPrimarySchoolMessages.primarySchool.expertService,
  },
  {
    value: ReasonForApplicationOptions.SICKLY,
    label: newPrimarySchoolMessages.primarySchool.sickly,
  },
  {
    value: ReasonForApplicationOptions.LIVES_IN_TWO_HOMES,
    label: newPrimarySchoolMessages.primarySchool.livesInTwoHomes,
  },
  {
    value: ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL,
    label: newPrimarySchoolMessages.primarySchool.siblingsTitle,
  },
  {
    value: ReasonForApplicationOptions.MOVING_ABROAD,
    label: newPrimarySchoolMessages.primarySchool.movingAbroad,
  },
  {
    value: ReasonForApplicationOptions.OTHER_REASONS,
    label: newPrimarySchoolMessages.primarySchool.otherReasons,
  },
]

export const getReasonForApplicationOptionLabel = (
  value: ReasonForApplicationOptions,
) => {
  const reasonForApplicationOptions = getReasonForApplicationOptions()
  return (
    reasonForApplicationOptions.find((option) => option.value === value)
      ?.label ?? ''
  )
}

export const getSiblingRelationOptions = () => [
  {
    value: SiblingRelationOptions.SIBLING,
    label: newPrimarySchoolMessages.primarySchool.siblingsRelationSibling,
  },
  {
    value: SiblingRelationOptions.HALF_SIBLING,
    label: newPrimarySchoolMessages.primarySchool.halfSiblingsRelationSibling,
  },
  {
    value: SiblingRelationOptions.STEP_SIBLING,
    label: newPrimarySchoolMessages.primarySchool.stepSiblingsRelationSibling,
  },
]

export const getSiblingRelationOptionLabel = (
  value: SiblingRelationOptions,
) => {
  const relationOptions = getSiblingRelationOptions()
  return relationOptions.find((option) => option.value === value)?.label ?? ''
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
