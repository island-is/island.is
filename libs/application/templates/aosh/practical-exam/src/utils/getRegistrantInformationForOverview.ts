import { getValueViaPath } from '@island.is/application/core'
import { FormValue, KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { InformationType } from '../lib/dataSchema'
import { formatPhoneNumber } from './validation'

export const getRegistrantInformationForOverview = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const information = getValueViaPath<InformationType>(answers, 'information')

  return [
    {
      width: 'full',
      keyText: overview.registrant.title,
      valueText: [
        {
          ...overview.registrant.name,
          values: {
            value: information?.name,
          },
        },
        {
          ...overview.registrant.nationalId,
          values: {
            value: formatKennitala(information?.nationalId || ''),
          },
        },
        {
          ...overview.registrant.phone,
          values: {
            value: formatPhoneNumber(information?.phone || ''),
          },
        },
        {
          ...overview.registrant.email,
          values: {
            value: information?.email,
          },
        },
      ],
    },
  ]
}
