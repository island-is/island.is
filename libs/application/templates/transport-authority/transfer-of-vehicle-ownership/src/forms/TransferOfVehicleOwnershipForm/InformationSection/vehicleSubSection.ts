import { Application, VehiclesCurrentVehicle } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildDateField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: 'Ökutæki',
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.title,
      description: information.general.description,
      children: [
        buildTextField({
          id: 'vehicle.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'full',
          disabled: true,
          defaultValue: (application: Application) => {
            const currentVehicleList = application.externalData
              ?.currentVehicleList?.data as VehiclesCurrentVehicle[]
            const vehicleValue = application.answers.pickVehicle.vehicle
            const vehicle = currentVehicleList[parseInt(vehicleValue, 10)]
            return vehicle.permno
          },
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'full',
          disabled: true,
          defaultValue: (application: Application) => {
            const currentVehicleList = application.externalData
              ?.currentVehicleList?.data as VehiclesCurrentVehicle[]
            const vehicleValue = application.answers.pickVehicle.vehicle
            const vehicle = currentVehicleList[parseInt(vehicleValue, 10)]
            return vehicle.make
          },
        }),
        buildTextField({
          id: 'vehicle.salePrice',
          title: information.labels.vehicle.salePrice,
          required: true,
          width: 'full',
        }),
        buildDateField({
          id: 'vehicle.date',
          title: information.labels.vehicle.date,
          required: true,
          width: 'full',
          minDate: () => {
            const today = new Date()
            // Maybe have option if buyer to have sellers date.
            return today
          },
        }),
      ],
    }),
  ],
})
