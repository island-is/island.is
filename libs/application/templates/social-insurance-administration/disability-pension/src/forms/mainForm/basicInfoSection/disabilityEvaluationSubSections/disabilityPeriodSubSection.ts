import {
  buildMultiField,
  buildSelectField,
  buildTitleField,
} from '@island.is/application/core'
import { SectionRouteEnum } from '../../../../types'
import { getYears } from '../../../../utils/dates'
import * as m from '../../../../lib/messages'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

export const disabilityPeriodFields = buildMultiField({
  id: SectionRouteEnum.DISABILITY_PERIOD,
  title: m.disabilityPeriod.title,
  description: m.disabilityPeriod.description,
  children: [
    buildTitleField({
      title: m.disabilityPeriod.chooseDate,
      titleVariant: 'h5',
    }),
    buildSelectField({
      id: `${SectionRouteEnum.DISABILITY_PERIOD}.year`,
      title: m.shared.year,
      width: 'half',
      placeholder: m.shared.chooseYear,
      options: () => {
        const years = getYears(2)
        return years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.DISABILITY_PERIOD}.month`,
      title: m.shared.month,
      width: 'half',
      placeholder: m.shared.chooseMonth,
      options: () => {
        const months = MONTHS
        return months.map((month, i) => ({
          value: i.toString(),
          label: month.label,
        }))
      },
    }),
  ],
})
