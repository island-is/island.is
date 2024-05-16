import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Children, Person } from './types'
import * as kennitala from 'kennitala'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const childsNationalId = getValueViaPath(
    answers,
    'childsNationalId',
  ) as string

  const parent1 = getValueViaPath(answers, 'parent1') as Person

  const parent2 = getValueViaPath(answers, 'parent2') as Person

  return { childsNationalId, parent1, parent2 }
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

export const isChildAtPrimarySchoolAge = (nationalId: string): boolean => {
  // Check if the child is at primary school age
  if (
    kennitala.info(nationalId).age >= 5 &&
    kennitala.info(nationalId).age <= 15
  ) {
    return true
  }

  // TODO: set as false
  return true
}

export const getOtherParent = (
  application: Application,
): Person | undefined => {
  const { childsNationalId } = getApplicationAnswers(application.answers)
  const { children } = getApplicationExternalData(application.externalData)

  // Find the child name since we only have nationalId in the answers
  const selectedChild = children.find((child) => {
    return child.nationalId === childsNationalId
  })

  console.log('selectedChild', selectedChild?.otherParent)

  return selectedChild?.otherParent as Person | undefined
}
