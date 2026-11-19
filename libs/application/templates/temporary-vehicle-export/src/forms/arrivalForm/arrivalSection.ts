import {
  buildAlertMessageField,
  buildDateField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { formatDate } from '../../utils/getOverviewItems'
import {
  formatMileage,
  getDepartureDate,
  getDepartureMileage,
  startOfDaysAgo,
  toDate,
} from '../../utils/helpers'
import { MAX_DAYS_BACK } from '../../utils/constants'

const getApplicationDepartureDate = (application: Application) =>
  getDepartureDate(application.answers)

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
              date: formatDate(getApplicationDepartureDate(application)),
              mileage: formatMileage(getDepartureMileage(application.answers)),
            },
          }),
        }),
        buildDateField({
          id: 'arrival.date',
          title: m.arrival.date,
          width: 'half',
          required: true,
          minDate: (application) => {
            // Today or up to MAX_DAYS_BACK days back, but not before departure
            const earliest = startOfDaysAgo(MAX_DAYS_BACK)
            const departure = toDate(getApplicationDepartureDate(application))
            return departure && departure > earliest ? departure : earliest
          },
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
          defaultValue: getApplicationDepartureDate,
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
