import { ExternalData, FormValue, KeyValueItem } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { overview } from '../lib/messages'
import { isContactDifferentFromApplicant } from './isContactDifferentFromApplicant'

export const getApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overview.applicant,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        formatKennitala(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        {
          ...overview.phoneNumber,
          values: {
            value:
              getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
          },
        },
        getValueViaPath<string>(answers, 'applicant.email') ?? '',
      ],
    },
  ]
}

export const getContactOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isDifferent = isContactDifferentFromApplicant(answers)
  let valueText: Array<string | { [key: string]: any }> = []
  
  if (isDifferent) {
    valueText = [
      {
        ...overview.name,
        values: {
          value: getValueViaPath<string>(answers, 'contact.name') ?? '',
        },
      },
      {
        ...overview.email,
        values: {
          value: getValueViaPath<string>(answers, 'contact.email') ?? '',
        },
      },
      {
        ...overview.phoneNumber,
        values: {
          value: getValueViaPath<string>(answers, 'contact.phone') ?? '',
        },
      },
    ]
  } else {
    valueText = [
      {
        ...overview.contactIsSameAsApplicant,
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: overview.contact,
      valueText: valueText,
    },
  ]
}

