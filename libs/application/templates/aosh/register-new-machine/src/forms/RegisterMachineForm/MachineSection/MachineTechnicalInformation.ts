import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { machine } from '../../../lib/messages'

export const MachineTechnicalInformation = buildSubSection({
  id: 'machineTechnicalInformation',
  title: machine.labels.technicalMachineInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineTechnicalInformationMultiField',
      title: machine.labels.technicalMachineInformation.title,
      description: machine.labels.technicalMachineInformation.description,
      children: [
        buildCustomField({
          id: 'machine.technicalInfo',
          component: 'TechnicalInfo',
        }),
      ],
    }),
  ],
})
