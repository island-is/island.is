import { NO, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  YesOrNo,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import {
  Child,
  ChildInformation,
  FriggChildInformation,
  Parents,
  Person,
  RelativesRow,
  SelectOption,
  SiblingsRow,
} from '../types'
import {
  Gender,
  ReasonForApplicationOptions,
  RelationOptions,
  SiblingRelationOptions,
} from './constants'
import { newPrimarySchoolMessages } from './messages'

import { ApolloClient } from '@apollo/client'
import { friggOptionsQuery } from '../graphql/queries'
import { FriggOptionsQuery, FriggOptionsQueryVariables } from '../types/schema'

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

  const hasFoodAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodAllergies',
  ) as string[]

  const foodAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodAllergies',
  ) as string[]

  const hasFoodIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodIntolerances',
  ) as string[]

  const foodIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodIntolerances',
  ) as string[]

  const isUsingEpiPen = getValueViaPath(
    answers,
    'allergiesAndIntolerances.isUsingEpiPen',
  ) as YesOrNo

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

  const photographyConsent = getValueViaPath(
    answers,
    'photography.photographyConsent',
  ) as YesOrNo

  const photoSchoolPublication = getValueViaPath(
    answers,
    'photography.photoSchoolPublication',
  ) as YesOrNo

  const photoMediaPublication = getValueViaPath(
    answers,
    'photography.photoMediaPublication',
  ) as YesOrNo

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
    hasFoodAllergies,
    foodAllergies,
    hasFoodIntolerances,
    foodIntolerances,
    isUsingEpiPen,
    developmentalAssessment,
    specialSupport,
    requestMeeting,
    photographyConsent,
    photoSchoolPublication,
    photoMediaPublication,

    startDate,
    schoolMunicipality,
    selectedSchool,
  }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as Child[]

  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.name',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.postalCode',
  ) as string

  const applicantCity = getValueViaPath(
    externalData,
    'nationalRegistry.data.address.city',
  ) as string

  const otherParentName = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data.otherParent.fullName',
  ) as string

  const childInformation = getValueViaPath(
    externalData,
    'childInformation.data',
  ) as FriggChildInformation

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    otherParentName,
    childInformation,
  }
}

export const canApply = (child: Child): boolean => {
  // Check if the child is at primary school age and lives with the applicant
  if (
    kennitala.info(child.nationalId).age >= 5 &&
    kennitala.info(child.nationalId).age <= 15 &&
    child.livesWithApplicant
  ) {
    return true
  }

  return false
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

export const getRelationOptions = () => [
  {
    value: RelationOptions.GRANDPARENT,
    label:
      newPrimarySchoolMessages.childrenNParents.relativesRelationGrandparent,
  },
  {
    value: RelationOptions.SIBLING,
    label: newPrimarySchoolMessages.childrenNParents.relativesRelationSibling,
  },
  {
    value: RelationOptions.STEPPARENT,
    label:
      newPrimarySchoolMessages.childrenNParents.relativesRelationStepparent,
  },
  {
    value: RelationOptions.RELATIVE,
    label: newPrimarySchoolMessages.childrenNParents.relativesRelationRelative,
  },
  {
    value: RelationOptions.FRIEND_OR_OTHER,
    label:
      newPrimarySchoolMessages.childrenNParents.relativesRelationFriendOrOther,
  },
]

export const getRelationOptionLabel = (value: RelationOptions) => {
  const relationOptions = getRelationOptions()
  return relationOptions.find((option) => option.value === value)?.label ?? ''
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

export const getGenderOptions = () => [
  {
    value: Gender.MALE,
    label: newPrimarySchoolMessages.shared.male,
  },
  {
    value: Gender.FEMALE,
    label: newPrimarySchoolMessages.shared.female,
  },
  {
    value: Gender.OTHER,
    label: newPrimarySchoolMessages.shared.otherGender,
  },
]

export const formatGender = (genderCode?: string): Gender | undefined => {
  switch (genderCode) {
    case '1':
    case '3':
      return Gender.MALE
    case '2':
    case '4':
      return Gender.FEMALE
    case '7':
    case '8':
      return Gender.OTHER
    default:
      return undefined
  }
}

export const getGenderOptionLabel = (value: Gender) => {
  const genderOptions = getGenderOptions()
  return genderOptions.find((option) => option.value === value)?.label ?? ''
}

export const getOptionsListByType = async (
  apolloClient: ApolloClient<object>,
  type: string,
  lang: Locale,
) => {
  const { data } = await apolloClient.query<
    FriggOptionsQuery,
    FriggOptionsQueryVariables
  >({
    query: friggOptionsQuery,
    variables: {
      type: {
        type,
      },
    },
  })

  return (
    data?.friggOptions?.flatMap(({ options }) =>
      options.flatMap(({ value, key }) => {
        let content = value.find(({ language }) => language === lang)?.content
        if (!content) {
          content = value.find(({ language }) => language === 'is')?.content
        }
        return { value: key ?? '', label: content ?? '' }
      }),
    ) ?? []
  )
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
