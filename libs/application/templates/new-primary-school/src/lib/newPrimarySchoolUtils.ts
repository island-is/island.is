import { NO, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
  YesOrNo,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { Child, Parents, Person, RelativesRow, SiblingsRow } from '../types'
import {
  FoodAllergiesOptions,
  FoodIntolerancesOptions,
  RelationOptions,
  SiblingRelationOptions,
} from './constants'
import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childNationalId = getValueViaPath(answers, 'childNationalId') as string

  const parents = getValueViaPath(answers, 'parents') as Parents

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  const siblings = getValueViaPath(answers, 'siblings') as SiblingsRow[]

  const hasFoodAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodAllergies',
  ) as string[]

  const foodAllergies = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodAllergies',
  ) as FoodAllergiesOptions

  const hasFoodIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.hasFoodIntolerances',
  ) as string[]

  const foodIntolerances = getValueViaPath(
    answers,
    'allergiesAndIntolerances.foodIntolerances',
  ) as FoodIntolerancesOptions

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
    parents,
    relatives,
    siblings,
    developmentalAssessment,
    specialSupport,
    requestMeeting,
    photographyConsent,
    photoSchoolPublication,
    photoMediaPublication,
    hasFoodAllergies,
    foodAllergies,
    hasFoodIntolerances,
    foodIntolerances,
    isUsingEpiPen,
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

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    otherParentName,
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

export const hasChildrenThatCanApply = (application: Application) => {
  if (!application) {
    return false
  }

  const { children } = getApplicationExternalData(application.externalData)

  // No child found
  if (!children || children.length === 0) {
    return false
  }

  // Check if the applicant has some children at primary school age
  return children.some((child) => canApply(child))
}

export const getOtherParent = (
  application: Application,
): Person | undefined => {
  const { childNationalId } = getApplicationAnswers(application.answers)
  const { children } = getApplicationExternalData(application.externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childNationalId
  })

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

export const getFoodAllergiesOptions = () => [
  {
    value: FoodAllergiesOptions.EGG_ALLERGY,
    label: newPrimarySchoolMessages.differentNeeds.eggAllergy,
  },
  {
    value: FoodAllergiesOptions.FISH_ALLERGY,
    label: newPrimarySchoolMessages.differentNeeds.fishAllergy,
  },
  {
    value: FoodAllergiesOptions.PENUT_ALLERGY,
    label: newPrimarySchoolMessages.differentNeeds.nutAllergy,
  },
  {
    value: FoodAllergiesOptions.WHEAT_ALLERGY,
    label: newPrimarySchoolMessages.differentNeeds.wheatAllergy,
  },
  {
    value: FoodAllergiesOptions.MILK_ALLERGY,
    label: newPrimarySchoolMessages.differentNeeds.milkAllergy,
  },
  {
    value: FoodAllergiesOptions.OTHER,
    label: newPrimarySchoolMessages.differentNeeds.other,
  },
]

export const getFoodAllergiesOptionsLabel = (value: FoodAllergiesOptions) => {
  const foodAllergiesOptions = getFoodAllergiesOptions()
  return (
    foodAllergiesOptions.find((option) => option.value === value)?.label ?? ''
  )
}

export const getFoodIntolerancesOptions = () => [
  {
    value: FoodIntolerancesOptions.LACTOSE_INTOLERANCE,
    label: newPrimarySchoolMessages.differentNeeds.lactoseIntolerance,
  },
  {
    value: FoodIntolerancesOptions.GLUTEN_INTOLERANCE,
    label: newPrimarySchoolMessages.differentNeeds.glutenIntolerance,
  },
  {
    value: FoodIntolerancesOptions.MSG_INTOLERANCE,
    label: newPrimarySchoolMessages.differentNeeds.msgIntolerance,
  },
  {
    value: FoodIntolerancesOptions.OTHER,
    label: newPrimarySchoolMessages.differentNeeds.other,
  },
]

export const getFoodIntolerancesOptionsLabel = (
  value: FoodIntolerancesOptions,
) => {
  const foodIntolerancesOptions = getFoodIntolerancesOptions()
  return (
    foodIntolerancesOptions.find((option) => option.value === value)?.label ??
    ''
  )
}
