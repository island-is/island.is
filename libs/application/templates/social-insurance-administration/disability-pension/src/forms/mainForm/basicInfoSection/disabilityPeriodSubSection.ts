import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { MONTHS } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { SectionRouteEnum } from '../../../types/routes'
import { generatePast24Months } from '../../../utils/generateYearsAndMonths'
import { getApplicationAnswers } from '../../../utils'

export const disabilityPeriodSubsection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_PERIOD,
  title: m.disabilityPeriod.title,
  children: [
    buildMultiField({
      title: m.disabilityPeriod.tabTitle,
      description: m.disabilityPeriod.description,
      children: [
        buildDescriptionField({
          id: `${SectionRouteEnum.DISABILITY_PERIOD}.description`,
          title: m.disabilityPeriod.chooseDate,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: `${SectionRouteEnum.DISABILITY_PERIOD}.year`,
          title: m.shared.year,
          width: 'half',
          placeholder: m.shared.chooseYear,
          options: () => {
            const years = generatePast24Months()
            const yearValues = Object.keys(years)
            return yearValues.map((year) => ({
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

          options: ({ answers }) => {
            const pastYearsWithMonths = generatePast24Months()
            const { disabilityRenumerationDateYear } =
              getApplicationAnswers(answers)

            const validMonths = disabilityRenumerationDateYear
              ? pastYearsWithMonths[
                  Number.parseInt(disabilityRenumerationDateYear)
                ]
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            return validMonths.map((validMonth) => {
              const month = MONTHS[validMonth]
              return {
                value: validMonth.toString(),
                label: month.label,
              }
            })
          },
        }),
      ],
    }),
  ],
})
