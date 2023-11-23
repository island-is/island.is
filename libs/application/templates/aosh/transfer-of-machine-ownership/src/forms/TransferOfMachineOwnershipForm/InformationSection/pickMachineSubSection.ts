import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const pickMachineSubSection = buildSubSection({
  id: 'pickVehicle',
  title: information.labels.pickMachine.sectionTitle,
  children: [
    buildMultiField({
      id: 'pickVehicleMultiField',
      title: information.labels.pickMachine.title,
      description: information.labels.pickMachine.description,
      children: [
        buildCustomField({
          id: 'pickMachine',
          component: 'MachinesField',
          title: '',
        }),
      ],
    }),
  ],
})
