// import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildDateField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
// import { getSelectedVehicle } from '../../../utils'

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
          readOnly: true,
          // defaultValue: (application: Application) => {
          //   const vehicle = getSelectedVehicle(application)
          //   return vehicle.permno
          // },
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          // defaultValue: (application: Application) => {
          //   const vehicle = getSelectedVehicle(application)
          //   return vehicle.make
          // },
        }),
        buildTextField({
          id: 'vehicle.salePrice',
          title: information.labels.vehicle.salePrice,
          width: 'full',
        }),
        buildDateField({
          id: 'vehicle.date',
          title: information.labels.vehicle.date,
          required: true,
          width: 'full',
          maxDate: new Date(),
          minDate: () => {
            const minDate = new Date()
            minDate.setDate(minDate.getDate() - 7)
            return minDate
          },
          // defaultValue: (application: Application) => {
          //   return new Date().toISOString().substring(0, 10)
          // },
        }),
      ],
    }),
  ],
})
