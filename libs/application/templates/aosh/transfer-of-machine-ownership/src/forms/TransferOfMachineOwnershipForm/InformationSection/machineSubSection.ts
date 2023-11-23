import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildDateField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedMachine } from '../../../utils/getSelectedMachine'
import { Machine } from '../../../shared/types'

export const machineSubSection = buildSubSection({
  id: 'machine',
  title: information.labels.machine.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineMultiField',
      title: information.labels.machine.title,
      description: information.labels.machine.description,
      children: [
        buildTextField({
          id: 'machine.regNumber',
          title: information.labels.machine.registrationNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.regNumber
          },
        }),
        buildTextField({
          id: 'machine.category',
          title: information.labels.machine.category,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.category
          },
        }),
        buildTextField({
          id: 'machine.type',
          title: information.labels.machine.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.type || ''
          },
        }),
        buildTextField({
          id: 'machine.subType',
          title: information.labels.machine.subType,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.subType || ''
          },
        }),
        buildCustomField({
          id: 'machineSubSection',
          title: '',
          component: 'AdditionalMachineSubSection',
        }),
        buildDateField({
          id: 'machine.date',
          title: information.labels.machine.date,
          required: false,
          width: 'half',
          maxDate: new Date(),
          minDate: () => {
            const minDate = new Date()
            minDate.setDate(minDate.getDate() - 7)
            return minDate
          },
          defaultValue: new Date().toISOString().substring(0, 10),
        }),
      ],
    }),
  ],
})
