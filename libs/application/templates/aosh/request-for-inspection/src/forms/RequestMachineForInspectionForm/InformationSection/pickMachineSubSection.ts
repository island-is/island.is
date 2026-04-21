import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const pickMachineSubSection = buildSubSection({
  id: 'pickMachine',
  title: information.labels.pickMachine.sectionTitle,
  children: [
    buildMultiField({
      id: 'pickMachineMultiField',
      title: information.labels.pickMachine.title,
      description: information.labels.pickMachine.description,
      children: [
        buildCustomField({
          id: 'machine',
          component: 'TabsField',
          title: '',
        }),
        buildAlertMessageField({
          id: 'pickMachineAlertMessage',
          title: information.labels.pickMachine.infoTitle,
          message: information.labels.pickMachine.infoMessage,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
