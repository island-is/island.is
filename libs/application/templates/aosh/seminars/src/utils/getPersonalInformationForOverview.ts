import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const getPersonalInformationForOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'applicant.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'applicant.name')

  return [
    {
      width: 'full',
      valueText: [
        {
          ...overview.personalInfo.name,
          values: {
            value: applicantName,
          },
        },
        {
          ...overview.personalInfo.nationalId,
          values: {
            value: formatKennitala(applicantNationalId ?? ''),
          },
        },
      ],
    },
  ]
}
