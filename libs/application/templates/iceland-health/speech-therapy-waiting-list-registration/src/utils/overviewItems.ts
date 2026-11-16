import { NO, YES } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import {
  childMessages,
  guardiansMessages,
  otherInformationMessages,
  overviewMessages,
  sharedMessages,
} from '../lib/messages'
import { Locale } from '@island.is/shared/types'
import { getApplicationAnswers } from './getApplicationAnswers'
import {
  getLanguageOptions,
  getLocationOptions,
  getOptionLabel,
  getRejectionReasonOptions,
  getSpeechPathologistOptions,
} from './speechTherapyWaitingListRegistrationUtils'

export const childItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
  const {
    childName,
    childNationalId,
    childStreetAddress,
    childLocality,
    waitingListConsent,
    waitingListDeclineReason,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'half',
      keyText: sharedMessages.fullName,
      valueText: childName,
    },
    {
      width: 'half',
      keyText: sharedMessages.nationalId,
      valueText: formatKennitala(childNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: childMessages.address,
      valueText: childStreetAddress,
    },
    {
      width: 'half',
      keyText: childMessages.municipality,
      valueText: childLocality,
    },
    {
      width: 'half',
      keyText: overviewMessages.waitingListConsent,
      valueText:
        waitingListConsent === YES
          ? childMessages.waitingListConsentYes
          : childMessages.waitingListConsentNo,
    },
    ...(waitingListConsent === NO
      ? [
          {
            width: 'half' as const,
            keyText: childMessages.waitingListDeclineReason,
            valueText: getOptionLabel(
              getRejectionReasonOptions(externalData, locale),
              waitingListDeclineReason,
            ),
          },
        ]
      : []),
  ]
}

export const guardiansItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  index: number,
): Array<KeyValueItem> => {
  const { guardians } = getApplicationAnswers(answers)
  const guardian = guardians[index]

  return [
    {
      width: 'half',
      keyText: sharedMessages.fullName,
      valueText: guardian?.fullName,
    },
    {
      width: 'half',
      keyText: sharedMessages.nationalId,
      valueText: formatKennitala(guardian?.nationalId ?? ''),
    },
    {
      width: 'half',
      keyText: guardiansMessages.email,
      valueText: guardian?.email,
      hideIfEmpty: true,
    },
    {
      width: 'half',
      keyText: guardiansMessages.phoneNumber,
      valueText: formatNumber(guardian?.phoneNumber ?? '', 'International'),
      hideIfEmpty: true,
    },
  ]
}

export const otherInformationItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { languages, locations, chosenSpeechPathologist, remoteTherapy } =
    getApplicationAnswers(answers)

  return [
    ...languages
      .filter(({ language }) => !!language)
      .map(({ language }, index) => ({
        width: 'half' as const,
        keyText: {
          ...otherInformationMessages.languageSelectionTitle,
          values: { index: index + 1 },
        },
        valueText: getOptionLabel(getLanguageOptions(externalData), language),
      })),
    ...locations
      .filter(({ location }) => !!location)
      .map(({ location }, index) => ({
        width: 'half' as const,
        keyText: {
          ...otherInformationMessages.locationSelectionTitle,
          values: { index: index + 1 },
        },
        valueText: getOptionLabel(getLocationOptions(externalData), location),
      })),
    {
      width: 'half',
      keyText: otherInformationMessages.speechTherapistSelectionTitle,
      valueText: getOptionLabel(
        getSpeechPathologistOptions(externalData),
        chosenSpeechPathologist,
      ),
      hideIfEmpty: true,
    },
    {
      width: 'full',
      keyText: otherInformationMessages.remoteTherapyConfirmation,
      valueText: remoteTherapy.includes(YES)
        ? sharedMessages.yes
        : sharedMessages.no,
    },
  ]
}
