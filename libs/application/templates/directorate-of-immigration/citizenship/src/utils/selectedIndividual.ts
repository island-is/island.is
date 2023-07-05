import { ExternalData, FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { getSelectedCustodyChild } from './'
import * as kennitala from 'kennitala'
import { CitizenIndividual } from '../shared'

export const isIndividualSelected = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): boolean => {
  if (sectionIndex === 0) return true

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
    const individual = getValueViaPath(
      externalData,
      'individual.data',
      undefined,
    ) as CitizenIndividual | undefined

    return individual?.fullName
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
    const individual = getValueViaPath(
      externalData,
      'individual.data',
      undefined,
    ) as CitizenIndividual | undefined

    return individual?.nationalId
      ? kennitala.info(individual?.nationalId).age
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
