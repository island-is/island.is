import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'

import { information } from '../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { getSelectedVehicle } from '../../utils'

export const userInformationSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.pageTitle,
      description: information.labels.vehicle.description,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: information.labels.vehicle.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'vehicle.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle?.make
          },
        }),
      ],
    }),
  ],
})
