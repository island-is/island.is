import {
  buildDateField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import {
  formatMileage,
  getSelectedVehicle,
  getVehicleLabel,
} from '../../utils/helpers'

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
        buildDateField({
          id: 'departure.date',
          title: m.departure.date,
          width: 'half',
          required: true,
          maxDate: () => new Date(),
        }),
        buildTextField({
          id: 'departure.mileage',
          title: m.departure.mileage,
          width: 'half',
          variant: 'number',
          required: true,
          thousandSeparator: true,
          suffix: ' km',
        }),
        buildHiddenInput({
          id: 'departure.latestMileage',
          defaultValue: (application: Application) =>
            getSelectedVehicle(
              application.answers,
              application.externalData,
            )?.latestMileage?.toString(),
        }),
      ],
    }),
  ],
})
