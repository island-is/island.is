import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.pickVehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.pickVehicle.title,
      description: information.labels.pickVehicle.description,
      children: [
        buildCustomField({
          id: 'selectVehicle',
          component: 'SelectVehicle',
        }),
      ],
    }),
  ],
})
