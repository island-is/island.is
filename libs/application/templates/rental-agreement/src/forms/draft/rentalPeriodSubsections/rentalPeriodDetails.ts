import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
  YesOrNoEnum,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import { rentalPeriodIsDefinite } from '../../../utils/rentalPeriodUtils'
import { rentalPeriod } from '../../../lib/messages'
import addMonths from 'date-fns/addMonths'

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
          clearOnChange: ['rentalPeriod.endDate'],
          minDate: new Date(2023, 0, 1),
        }),
        buildDateField({
          id: 'rentalPeriod.endDate',
          title: rentalPeriod.endDateTitle,
          placeholder: rentalPeriod.endDatePlaceholder,
          required: true,
          minDate: ({ answers }) => {
            const dateFrom =
              getValueViaPath<string>(answers, 'rentalPeriod.startDate') ?? ''
            return addMonths(new Date(dateFrom), 1)
          },
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
