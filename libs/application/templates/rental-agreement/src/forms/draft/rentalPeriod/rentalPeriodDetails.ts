import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Routes, TRUE } from '../../../lib/constants'
import { rentalPeriod } from '../../../lib/messages'

const rentalPeriodIsDefinite = (answers: FormValue) => {
  const rentalPeriodDefinite = getValueViaPath(
    answers,
    'rentalPeriod.isDefinite',
    [],
  ) as string[]
  return rentalPeriodDefinite && rentalPeriodDefinite.includes(TRUE)
}

export const RentalPeriodDetails = buildSubSection({
  id: Routes.RENTALPERIOD,
  title: rentalPeriod.subSectionName,
  children: [
    buildMultiField({
      id: Routes.RENTALPERIOD,
      title: rentalPeriod.pageTitle,
      description: rentalPeriod.pageDescription,
      children: [
        buildDateField({
          id: 'rentalPeriod.startDate',
          title: rentalPeriod.startDateTitle,
          placeholder: rentalPeriod.startDatePlaceholder,
          required: true,
        }),
        buildDateField({
          id: 'rentalPeriod.endDate',
          title: rentalPeriod.endDateTitle,
          placeholder: rentalPeriod.endDatePlaceholder,
          required: true,
          condition: rentalPeriodIsDefinite,
        }),
        buildCheckboxField({
          id: 'rentalPeriod.isDefinite',
          title: '',
          options: [
            {
              value: TRUE,
              label: rentalPeriod.rentalPeriodDefiniteLabel,
            },
          ],
          clearOnChange: ['rentalPeriod.endDate'],
          spacing: 0,
        }),
        buildDescriptionField({
          id: 'rentalPeriod.termination',
          title: rentalPeriod.terminationLabel,
          titleVariant: 'h3',
          space: 3,
          description: rentalPeriod.terminationDescription,
        }),
      ],
    }),
  ],
})
