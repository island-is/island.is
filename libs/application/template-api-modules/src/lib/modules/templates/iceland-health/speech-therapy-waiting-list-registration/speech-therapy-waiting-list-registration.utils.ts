import { YES } from '@island.is/application/core'
import { getApplicationAnswers } from '@island.is/application/templates/iceland-health/speech-therapy-waiting-list-registration'
import { Application } from '@island.is/application/types'
import {
  UpdateWaitingListEntryRequestModel,
  WaitingListEntryRejectRequestModel,
} from '@island.is/clients/icelandic-health-insurance/speech-therapy'

export const transformApplicationToUpdateWaitingListEntry = (
  application: Application,
): UpdateWaitingListEntryRequestModel => {
  const { languages, locations, chosenSpeechPathologist, remoteTherapy } =
    getApplicationAnswers(application.answers)

  return {
    locations: locations
      .filter(({ location }) => !!location)
      .map(({ location }) => Number(location)),
    languages: languages
      .filter(({ language }) => !!language)
      .map(({ language }) => language),
    chosenSpeechPathologistKennitala: chosenSpeechPathologist || null,
    remote: remoteTherapy.includes(YES),
  }
}

export const transformApplicationToRejectWaitingListEntry = (
  application: Application,
): WaitingListEntryRejectRequestModel => {
  const { waitingListDeclineReason } = getApplicationAnswers(
    application.answers,
  )

  return {
    reasonId: Number(waitingListDeclineReason),
  }
}
