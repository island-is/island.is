import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TRUE } from '../../lib/constants'
import * as m from '../../lib/messages'

const rentalPeriodIsDefinite = (answers: FormValue) => {
  const rentalPeriodDefinite = getValueViaPath(
    answers,
    'rentalPeriod.isDefinite',
    [],
  ) as string[]
  return rentalPeriodDefinite && rentalPeriodDefinite.includes(TRUE)
}

export const RentalPeriodDetails = buildSubSection({
  id: 'rentalPeriod',
  title: m.rentalPeriodDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalPeriod.details',
      title: m.rentalPeriodDetails.pageTitle,
      description: m.rentalPeriodDetails.pageDescription,
      children: [
        buildDateField({
          id: 'rentalPeriod.startDate',
          title: m.rentalPeriodDetails.startDateTitle,
          placeholder: m.rentalPeriodDetails.startDatePlaceholder,
        }),
        buildDateField({
          id: 'rentalPeriod.endDate',
          title: m.rentalPeriodDetails.endDateTitle,
          placeholder: m.rentalPeriodDetails.endDatePlaceholder,
          condition: rentalPeriodIsDefinite,
        }),
        buildCheckboxField({
          id: 'rentalPeriod.isDefinite',
          title: '',
          options: [
            {
              value: TRUE,
              label: m.rentalPeriodDetails.rentalPeriodDefiniteLabel,
            },
          ],
          spacing: 0,
        }),

        buildDescriptionField({
          id: 'rentalPeriod.termination',
          title: m.rentalPeriodDetails.terminationLabel,
          titleVariant: 'h3',
          space: 3,
          description: m.rentalPeriodDetails.terminationDescription,
        }),
      ],
    }),
  ],
})
