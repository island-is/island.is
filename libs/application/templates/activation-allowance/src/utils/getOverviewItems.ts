import { ExternalData } from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { applicant } from '../lib/messages'
import { overview } from '../lib/messages/overview'
import { isSamePlaceOfResidenceChecked } from './isSamePlaceOfResidenceChecked'

export const getApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: applicant.general.pageTitle,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        formatKennitala(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        {
          ...overview.labels.nationalAddress,
          values: {
            value:
              getValueViaPath<string>(answers, 'applicant.nationalAddress') ??
              '',
          },
        },
        isSamePlaceOfResidenceChecked(answers)
          ? `${getValueViaPath<string>(
              answers,
              'applicant.other.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.other.postalCode',
            )}`
          : `${getValueViaPath<string>(
              answers,
              'applicant.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.postalCode',
            )} ${getValueViaPath<string>(answers, 'applicant.city')}`,
        {
          ...overview.labels.phoneNumber,
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

export const getOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: 'Full width',
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'Hvassaleiti 5',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'Reykjavík',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
  ]
}
