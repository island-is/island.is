import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { RelativesRow } from '../types'
import { Children, RelationOptions } from './constants'
import { newPrimarySchoolMessages } from './messages'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childsNationalId = getValueViaPath(
    answers,
    'childsNationalId',
  ) as string

  const relatives = getValueViaPath(answers, 'relatives') as RelativesRow[]

  return { childsNationalId, relatives }
}

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const children = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as Children[]

  const applicantName = getValueViaPath(
    externalData,
    'identity.data.name',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'identity.data.nationalId',
  ) as string

  const applicantAddress = getValueViaPath(
    externalData,
    'identity.data.address.streetAddress',
  ) as string

  const applicantPostalCode = getValueViaPath(
    externalData,
    'identity.data.address.postalCode',
  ) as string

  const city = getValueViaPath(
    externalData,
    'identity.data.address.city',
  ) as string

  const applicantMunicipality = applicantPostalCode + ' ' + city

  return {
    children,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
  }
}

export const isChildAtPrimarySchoolAge = (nationalId: string) => {
  // Check if the child is at primary school age
  if (
    kennitala.info(nationalId).age >= 5 &&
    kennitala.info(nationalId).age <= 15
  ) {
    return true
  }

  return false
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
