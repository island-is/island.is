import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildHiddenInput,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { VehiclesCurrentVehicle } from '../../../shared'
import { getSelectedVehicle } from '../../../utils'

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.title,
      description: information.labels.vehicle.description,
      children: [
        buildTextField({
          id: 'vehicleInfo.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle.permno
          },
        }),
        buildTextField({
          id: 'vehicleInfo.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle.make
          },
        }),
        buildHiddenInput({
          id: 'vehicleMileage.isRequired',
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle.requireMileage || false
          },
        }),
        buildTextField({
          id: 'vehicleMileage.value',
          title: information.labels.vehicle.mileage,
          width: 'half',
          variant: 'number',
        }),
      ],
    }),
  ],
})
