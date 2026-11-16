import { getValueViaPath, YesOrNo } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Guardian } from '../types'

export const getApplicationAnswers = (answers: FormValue) => {
  const selectedChildNationalId = getValueViaPath<string>(
    answers,
    'childNationalId',
  )

  const childName = getValueViaPath<string>(answers, 'child.name')

  const childNationalId = getValueViaPath<string>(answers, 'child.nationalId')

  const childStreetAddress = getValueViaPath<string>(
    answers,
    'child.address.streetAddress',
  )

  const childLocality = getValueViaPath<string>(
    answers,
    'child.address.locality',
  )

  const waitingListConsent = getValueViaPath<YesOrNo>(
    answers,
    'waitingList.consent',
  )

  const waitingListDeclineReason = getValueViaPath<string>(
    answers,
    'waitingList.declineReason',
  )

  const guardians = getValueViaPath<Guardian[]>(answers, 'guardians') ?? []

  const languages =
    getValueViaPath<Array<{ language: string }>>(
      answers,
      'otherInformation.languages',
    ) ?? []

  const locations =
    getValueViaPath<Array<{ location: string }>>(
      answers,
      'otherInformation.locations',
    ) ?? []

  const chosenSpeechPathologist = getValueViaPath<string>(
    answers,
    'otherInformation.chosenSpeechPathologist',
  )

  const speechTherapistConfirmation =
    getValueViaPath<string[]>(
      answers,
      'otherInformation.speechTherapistConfirmation',
    ) ?? []

  const remoteTherapy =
    getValueViaPath<string[]>(answers, 'otherInformation.remoteTherapy') ?? []

  return {
    selectedChildNationalId,
    childName,
    childNationalId,
    childStreetAddress,
    childLocality,
    waitingListConsent,
    waitingListDeclineReason,
    guardians,
    languages,
    locations,
    chosenSpeechPathologist,
    speechTherapistConfirmation,
    remoteTherapy,
  }
}
