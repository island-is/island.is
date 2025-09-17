import {
  buildDescriptionField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { SectionRouteEnum } from '../../../types/routes'
import { getYears } from '../../../utils/dates'

export const disabilityPeriodSubsection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_PERIOD,
  title: m.disabilityPeriod.title,
  tabTitle: m.disabilityPeriod.tabTitle,
  children: [
    buildDescriptionField({
      id: `${SectionRouteEnum.DISABILITY_PERIOD}.description`,
      title: m.disabilityPeriod.description,
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
