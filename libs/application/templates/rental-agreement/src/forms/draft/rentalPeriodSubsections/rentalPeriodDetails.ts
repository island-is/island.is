import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import { rentalPeriodIsDefinite } from '../../../utils/rentalPeriodUtils'
import { rentalPeriod } from '../../../lib/messages'

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
          options: [
            {
              value: YesOrNoEnum.YES,
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
