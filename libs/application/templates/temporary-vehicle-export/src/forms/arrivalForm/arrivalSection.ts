import {
  buildAlertMessageField,
  buildDateField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { formatDate } from '../../utils/getOverviewItems'
import { formatMileage, getDepartureMileage, toDate } from '../../utils/helpers'

const getDepartureDate = (application: Application) =>
  getValueViaPath<string>(application.answers, 'departure.date')

export const arrivalSection = buildSection({
  id: 'arrivalSection',
  title: m.arrival.sectionTitle,
  children: [
    buildMultiField({
      id: 'arrivalMultiField',
      title: m.arrival.title,
      description: m.arrival.description,
      children: [
        buildAlertMessageField({
          id: 'arrival.departureInfo',
          alertType: 'info',
          message: (application) => ({
            ...m.arrival.departureInfo,
            values: {
              date: formatDate(getDepartureDate(application)),
              mileage: formatMileage(getDepartureMileage(application.answers)),
            },
          }),
        }),
        buildDateField({
          id: 'arrival.date',
          title: m.arrival.date,
          width: 'half',
          required: true,
          minDate: (application) => toDate(getDepartureDate(application)),
          maxDate: () => new Date(),
        }),
        buildTextField({
          id: 'arrival.mileage',
          title: m.arrival.mileage,
          width: 'half',
          variant: 'number',
          required: true,
          thousandSeparator: true,
          suffix: ' km',
        }),
        buildHiddenInput({
          id: 'arrival.departureDate',
          defaultValue: getDepartureDate,
        }),
        buildHiddenInput({
          id: 'arrival.departureMileage',
          defaultValue: (application: Application) =>
            getDepartureMileage(application.answers)?.toString(),
        }),
      ],
    }),
  ],
})
