import type {
  ExternalData,
  KeyValueItem,
  FormValue,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

import { m } from '../lib/messages'

export const getParticipantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewSectionParticipantName,
      valueText:
        getValueViaPath<string>(answers, 'participantNationalIdAndName.name') ??
        '',
    },
    {
      width: 'full',
      keyText: m.overviewSectionParticipantNationalId,
      valueText:
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.nationalId',
        ) ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewSectionParticipantEmail,
      valueText:
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.email',
        ) ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewSectionParticipantPhone,
      valueText:
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.phone',
        ) ?? '',
    },
  ]
}

export const getPayerOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewSectionPayerName,
      valueText: getValueViaPath<string>(answers, 'payerNationalId') ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewSectionPayerNationalId,
      valueText: getValueViaPath<string>(answers, 'payerNationalId') ?? '',
    },
  ]
}
