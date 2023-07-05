import { ExternalData, FormValue } from '@island.is/application/types'
import { getSelectedApplicant, getSelectedCustodyChild } from './'
import * as kennitala from 'kennitala'

export const isIndividualSelected = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): boolean => {
  if (sectionIndex === 0) {
    const selectedApplicant = getSelectedApplicant(externalData, answers)
    return !!selectedApplicant
  }

  const selectedChild = getSelectedCustodyChild(
    externalData,
    answers,
    sectionIndex,
  )
  return !!selectedChild
}

export const getSelectedIndividualName = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): string | undefined => {
  if (sectionIndex === 0) {
    const selectedApplicant = getSelectedApplicant(externalData, answers)
    return selectedApplicant?.fullName
  }

  const selectedChild = getSelectedCustodyChild(
    externalData,
    answers,
    sectionIndex,
  )
  if (selectedChild) {
    return selectedChild.fullName
  }

  return undefined
}

export const getSelectedIndividualAge = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): number | undefined => {
  if (sectionIndex === 0) {
    const selectedApplicant = getSelectedApplicant(externalData, answers)
    return selectedApplicant
      ? kennitala.info(selectedApplicant?.nationalId).age
      : undefined
  }

  const selectedChild = getSelectedCustodyChild(
    externalData,
    answers,
    sectionIndex,
  )
  if (selectedChild) {
    return kennitala.info(selectedChild.nationalId).age
  }

  return undefined
}
