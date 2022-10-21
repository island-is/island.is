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
          width: 'half',
          disabled: true,
          required: true,
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
          required: true,
        }),
        buildTextField({
          id: 'vehicle.salePrice',
          title: information.labels.vehicle.salePrice,
          width: 'half',
        }),
        buildDateField({
          id: 'vehicle.date',
          title: information.labels.vehicle.date,
          width: 'half',
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
