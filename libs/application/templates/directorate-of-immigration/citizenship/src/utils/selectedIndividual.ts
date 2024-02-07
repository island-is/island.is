import { ExternalData, FormValue } from '@island.is/application/types'
import { getSelectedCustodyChild } from './'
import * as kennitala from 'kennitala'

export const isIndividualSelected = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): boolean => {
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
  const selectedChild = getSelectedCustodyChild(
    externalData,
    answers,
    sectionIndex,
  )

  if (selectedChild) {
    return `${selectedChild.givenName} ${selectedChild.familyName}`
  }

  return undefined
}

export const getSelectedIndividualAge = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): number | undefined => {
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
