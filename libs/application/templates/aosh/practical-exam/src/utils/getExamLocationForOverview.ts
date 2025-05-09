import { getValueViaPath } from '@island.is/application/core'
import { FormValue, KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { ExamLocationType } from '../lib/dataSchema'
export const getExamLocatioForOverview = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const examLocation = getValueViaPath<ExamLocationType>(
    answers,
    'examLocation',
  )
  const address = examLocation?.address
  const postalCode = examLocation?.postalCode
  const email = examLocation?.email
  const phone = examLocation?.phone

  return [
    {
      width: 'full',
      keyText: overview.examLocation.title,
      valueText: [
        {
          ...overview.examLocation.location,
          values: {
            address: address,
            postalCode: postalCode,
          },
        },
        {
          ...overview.examLocation.email,
          values: {
            value: email,
          },
        },
        {
          ...overview.examLocation.phone,
          values: {
            value: phone,
          },
        },
      ],
    },
  ]
}
