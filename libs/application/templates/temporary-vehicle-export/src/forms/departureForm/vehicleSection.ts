import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  formatMileage,
  getEligibleVehicles,
  getVehicleLabel,
} from '../../utils/helpers'

export const vehicleSection = buildSection({
  id: 'vehicleSection',
  title: m.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: m.vehicle.title,
      description: m.vehicle.description,
      children: [
        buildRadioField({
          id: 'vehicle.permno',
          largeButtons: true,
          required: true,
          options: (application) =>
            getEligibleVehicles(application.externalData).map((vehicle) => ({
              value: vehicle.permno,
              label: getVehicleLabel(vehicle),
              subLabel:
                vehicle.latestMileage !== undefined
                  ? {
                      ...m.departure.latestMileage,
                      values: {
                        mileage: formatMileage(vehicle.latestMileage),
                      },
                    }
                  : undefined,
            })),
        }),
      ],
    }),
  ],
})
