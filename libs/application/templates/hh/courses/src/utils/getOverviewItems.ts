import type {
  ExternalData,
  KeyValueItem,
  FormValue,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

import { m } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getParticipantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overview.participantName,
      valueText:
        getValueViaPath<string>(answers, 'participantNationalIdAndName.name') ??
        '',
    },
    {
      width: 'full',
      keyText: m.overview.participantNationalId,
      valueText:
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.nationalId',
        ) ?? '',
    },
    {
      width: 'full',
      keyText: m.overview.participantEmail,
      valueText:
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.email',
        ) ?? '',
    },
    {
      width: 'full',
      keyText: m.overview.participantPhone,
      valueText: formatPhoneNumber(
        getValueViaPath<string>(
          answers,
          'participantNationalIdAndName.phone',
        ) ?? '',
      ),
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
      keyText: m.overview.payerName,
      valueText: getValueViaPath<string>(answers, 'payerName') ?? '',
    },
    {
      width: 'full',
      keyText: m.overview.payerNationalId,
      valueText: getValueViaPath<string>(answers, 'payerNationalId') ?? '',
    },
  ]
}
