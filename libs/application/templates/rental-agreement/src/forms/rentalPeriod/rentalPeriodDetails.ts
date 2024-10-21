import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalPeriodDetails = buildSubSection({
  id: 'rentalPeriodDetails',
  title: m.rentalPeriodDetails.subSectionName,
  children: [
    buildMultiField({
      title: m.rentalPeriodDetails.pageTitle,
      description: m.rentalPeriodDetails.pageDescription,
      children: [
        buildDateField({
          id: 'rentalPeriodStartDate',
          title: m.rentalPeriodDetails.startDateTitle,
          placeholder: m.rentalPeriodDetails.startDatePlaceholder,
        }),
        buildDateField({
          id: 'rentalPeriodEndDate',
          title: m.rentalPeriodDetails.endDateTitle,
          placeholder: m.rentalPeriodDetails.endDatePlaceholder,
          condition: (answers) => {
            const rentalPeriodDefinite: string[] =
              answers.rentalPeriodDefinite as string[]

            return rentalPeriodDefinite && rentalPeriodDefinite.includes('true')
          },
        }),
        buildCheckboxField({
          id: 'rentalPeriodDefinite',
          title: '',
          options: [
            {
              value: 'true',
              label: m.rentalPeriodDetails.rentalPeriodDefiniteLabel,
            },
          ],
          spacing: 0,
        }),

        buildDescriptionField({
          id: 'rentalPeriodTermination',
          title: m.rentalPeriodDetails.terminationLabel,
          titleVariant: 'h3',
          space: 3,
          description: m.rentalPeriodDetails.terminationDescription,
        }),
      ],
    }),
  ],
})
