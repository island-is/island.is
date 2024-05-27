import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { Child, Person, RelativesRow } from '../types'
import { RelationOptions } from './constants'
import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childNationalId = getValueViaPath(answers, 'childNationalId') as string

  const parent1 = getValueViaPath(answers, 'parent1') as Person

  const parent2 = getValueViaPath(answers, 'parent2') as Person

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  return { childNationalId, parent1, parent2, relatives }
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

export const getOtherParent = (
  application: Application,
): Person | undefined => {
  const { childNationalId } = getApplicationAnswers(application.answers)
  const { children } = getApplicationExternalData(application.externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childNationalId
  })

  console.log('selectedChild', selectedChild?.otherParent)

  return selectedChild?.otherParent as Person | undefined
}

export const getRelationOptions = () => [
  {
    value: RelationOptions.GRANDPARENTS,
    label: newPrimarySchoolMessages.relatives.relationGrandparents,
  },
  {
    value: RelationOptions.SIBLINGS,
    label: newPrimarySchoolMessages.relatives.relationSiblings,
  },
  {
    value: RelationOptions.STEP_PARENT,
    label: newPrimarySchoolMessages.relatives.relationStepParent,
  },
  {
    value: RelationOptions.RELATIVES,
    label: newPrimarySchoolMessages.relatives.relationRelatives,
  },
  {
    value: RelationOptions.FRIENDS_AND_OTHER,
    label: newPrimarySchoolMessages.relatives.relationFriendsAndOther,
  },
]

export const getRelationOptionLabel = (value: RelationOptions) => {
  const relationOptions = getRelationOptions()
  return relationOptions.find((option) => option.value === value)?.label ?? ''
}
