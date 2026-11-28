import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import {
  LanguageCodeResponseModel,
  LocationResponseModel,
  RejectionReasonResponseModel,
  SpeechPathologistMinimalResponseModel,
} from '@island.is/clients/icelandic-health-insurance/speech-therapy'
import { Child } from '../types'

export const getApplicationExternalData = (externalData: ExternalData) => {
  const children = getValueViaPath<Child[]>(externalData, 'children.data') ?? []

  const languages =
    getValueViaPath<LanguageCodeResponseModel[]>(
      externalData,
      'languages.data',
    ) ?? []

  const availableLocations =
    getValueViaPath<LocationResponseModel[]>(
      externalData,
      'availableLocations.data',
    ) ?? []

  const speechPathologists =
    getValueViaPath<SpeechPathologistMinimalResponseModel[]>(
      externalData,
      'speechPathologists.data',
    ) ?? []

  const rejectionReasons =
    getValueViaPath<RejectionReasonResponseModel[]>(
      externalData,
      'rejectionReasons.data',
    ) ?? []

  return {
    children,
    languages,
    availableLocations,
    speechPathologists,
    rejectionReasons,
  }
}
