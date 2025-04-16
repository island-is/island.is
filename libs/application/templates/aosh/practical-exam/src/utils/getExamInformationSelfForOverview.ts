import { FormValue, KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'

export const getExamInformationSelfForOverview = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      valueText: [
        {
          ...overview.payment.invoice,
        },
        {
          ...overview.payment.explanation,
          values: {
            value: '',
          },
        },
      ],
    },
  ]
}
