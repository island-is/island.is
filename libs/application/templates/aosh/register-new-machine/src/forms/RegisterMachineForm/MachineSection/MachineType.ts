import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { machine } from '../../../lib/messages'

export const MachineType = buildSubSection({
  id: 'machineType',
  title: machine.labels.machineType.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineTypeMultiField',
      title: machine.labels.machineType.title,
      description: machine.labels.machineType.description,
      children: [
        buildCustomField({
          id: 'machine.machineType',
          component: 'MachineType',
        }),
      ],
    }),
  ],
})
