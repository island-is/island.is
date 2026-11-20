import {
  NO,
  YES,
  buildDateField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import {
  formatMileage,
  getSelectedVehicle,
  getVehicleLabel,
  startOfDaysAgo,
  usesLatestMileage,
  usesLatestMileageDate,
} from '../../utils/helpers'
import { formatDate } from '../../utils/getOverviewItems'
import { MAX_DAYS_BACK } from '../../utils/constants'

export const departureSection = buildSection({
  id: 'departureSection',
  title: m.departure.sectionTitle,
  children: [
    buildMultiField({
      id: 'departureMultiField',
      title: m.departure.title,
      description: m.departure.description,
      children: [
        buildDescriptionField({
          id: 'departure.vehicleInfo',
          titleVariant: 'h4',
          title: (application) =>
            getVehicleLabel(
              getSelectedVehicle(application.answers, application.externalData),
            ),
          description: (application) => {
            const vehicle = getSelectedVehicle(
              application.answers,
              application.externalData,
            )
            return vehicle?.latestMileage !== undefined
              ? {
                  ...m.departure.latestMileage,
                  values: { mileage: formatMileage(vehicle.latestMileage) },
                }
              : ''
          },
        }),
        buildRadioField({
          id: 'departure.useLatestMileage',
          title: m.departure.useLatestMileageTitle,
          titleVariant: 'h5',
          largeButtons: false,
          defaultValue: NO,
          condition: (answers, externalData) =>
            getSelectedVehicle(answers, externalData)?.latestMileage !==
            undefined,
          options: (application) => {
            const vehicle = getSelectedVehicle(
              application.answers,
              application.externalData,
            )
            const mileage = formatMileage(vehicle?.latestMileage)
            const date = formatDate(vehicle?.latestMileageReadDate)
            return [
              {
                value: YES,
                label: date
                  ? {
                      ...m.departure.useLatestMileage,
                      values: { mileage, date },
                    }
                  : {
                      ...m.departure.useLatestMileageWithoutDate,
                      values: { mileage },
                    },
              },
              { value: NO, label: m.departure.registerNewMileage },
            ]
          },
        }),
        buildDateField({
          id: 'departure.date',
          title: m.departure.date,
          width: 'half',
          required: true,
          minDate: () => startOfDaysAgo(MAX_DAYS_BACK),
          maxDate: () => new Date(),
          condition: (answers) => !usesLatestMileageDate(answers),
        }),
        buildTextField({
          id: 'departure.mileage',
          title: m.departure.mileage,
          width: 'half',
          variant: 'number',
          required: true,
          thousandSeparator: true,
          suffix: ' km',
          condition: (answers) => !usesLatestMileage(answers),
        }),
        buildHiddenInput({
          id: 'departure.latestMileageReadDate',
          // An empty string, not undefined, so a value saved for another
          // vehicle is cleared
          defaultValue: (application: Application) =>
            getSelectedVehicle(application.answers, application.externalData)
              ?.latestMileageReadDate ?? '',
        }),
        buildHiddenInput({
          id: 'departure.latestMileage',
          defaultValue: (application: Application) =>
            getSelectedVehicle(
              application.answers,
              application.externalData,
            )?.latestMileage?.toString() ?? '',
        }),
      ],
    }),
  ],
})
