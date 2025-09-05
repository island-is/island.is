import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildDateField,
  buildCheckboxField,
  YesOrNoEnum,
  getValueViaPath,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import {
  isDateMoreThanOneYearInFuture,
  rentalPeriodIsDefinite,
} from '../../../utils/rentalPeriodUtils'
import addMonths from 'date-fns/addMonths'
import * as m from '../../../lib/messages'

export const RentalPeriodDetails = buildSubSection({
  id: Routes.RENTALPERIOD,
  title: m.rentalPeriod.subSectionName,
  children: [
    buildMultiField({
      id: Routes.RENTALPERIOD,
      title: m.rentalPeriod.pageTitle,
      description: m.rentalPeriod.pageDescription,
      children: [
        buildAlertMessageField({
          id: 'rentalPeriod.alertMessage',
          title: m.rentalPeriod.alertMessageTitle,
          message: m.rentalPeriod.alertMessage,
          alertType: 'warning',
          condition: isDateMoreThanOneYearInFuture,
        }),
        buildDateField({
          id: 'rentalPeriod.startDate',
          title: m.rentalPeriod.startDateTitle,
          placeholder: m.rentalPeriod.startDatePlaceholder,
          required: true,
          clearOnChange: ['rentalPeriod.endDate'],
          minDate: new Date(2023, 0, 1),
        }),
        buildDateField({
          id: 'rentalPeriod.endDate',
          title: m.rentalPeriod.endDateTitle,
          placeholder: m.rentalPeriod.endDatePlaceholder,
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
              label: m.rentalPeriod.rentalPeriodDefiniteLabel,
            },
          ],
          clearOnChange: ['rentalPeriod.endDate'],
          spacing: 0,
        }),
        buildDescriptionField({
          id: 'rentalPeriod.termination',
          title: m.rentalPeriod.terminationLabel,
          titleVariant: 'h3',
          space: 3,
          description: m.rentalPeriod.terminationDescription,
        }),
      ],
    }),
  ],
})
