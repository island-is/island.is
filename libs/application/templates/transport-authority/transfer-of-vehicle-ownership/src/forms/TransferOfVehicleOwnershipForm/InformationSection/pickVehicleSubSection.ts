import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const pickVehicleSubSection = buildSubSection({
  id: 'pickVehicle',
  title: 'Veldu ökutæki',
  children: [
    buildMultiField({
      id: 'pickVehicleMultiField',
      title: information.labels.pickVehicle.title,
      description: information.general.description,
      children: [
        buildCustomField({
          id: 'pickVehicle',
          component: 'VehiclesField',
          title: '',
        }),
      ],
    }),
  ],
})
