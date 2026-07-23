import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'

import { KeyValueItem } from '@island.is/application/types'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import { mainForm as m } from '../lib/messages'

export const getOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  userNationalId: string,
): Array<KeyValueItem> => {
  const name = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
  )
  const countryId = getValueViaPath<string>(answers, 'countryAndDate.country')
  const countryList = getValueViaPath<Array<{ name: string; id: string }>>(
    externalData,
    'countries.data',
  )
  const countryName = countryList?.find((c) => c.id === countryId)?.name
  const dateString = getValueViaPath<string>(
    answers,
    'countryAndDate.departureDate',
  )
  const date = dateString ? new Date(dateString) : undefined
  const datePlusThreeMonths = date ? addMonths(date, 3) : undefined
  const validityPeriod =
    date && datePlusThreeMonths
      ? `${format(date, 'dd.MM.yyyy')} - ${format(
          datePlusThreeMonths,
          'dd.MM.yyyy',
        )}`
      : ''

  return [
    {
      width: 'half',
      keyText: m.overviewSection.nameLabel,
      valueText: name,
    },
    {
      width: 'half',
      keyText: m.overviewSection.ssnLabel,
      valueText: userNationalId,
    },
    {
      width: 'half',
      keyText: m.overviewSection.countryLabel,
      valueText: countryName,
    },
    {
      width: 'half',
      keyText: m.overviewSection.validityPeriodLabel,
      valueText: validityPeriod,
    },
  ]
}
