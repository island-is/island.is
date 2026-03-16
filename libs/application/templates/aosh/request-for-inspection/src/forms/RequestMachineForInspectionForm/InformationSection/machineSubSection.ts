import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedMachine } from '../../../utils/getSelectedMachine'
import { ExternalData, FormValue } from '@island.is/application/types'
import { MachineForInspectionDto } from '@island.is/clients/work-machines'

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
            ) as MachineForInspectionDto
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
            ) as MachineForInspectionDto
            return machine?.type || ''
          },
        }),
        buildTextField({
          id: 'machine.subType',
          title: information.labels.machine.subType,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (answers: FormValue, externalData: ExternalData) => {
            const machine = getSelectedMachine(
              externalData,
              answers,
            ) as MachineForInspectionDto
            return !!machine?.subType
          },
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            ) as MachineForInspectionDto
            return machine?.subType || ''
          },
        }),
        buildTextField({
          id: 'machine.ownerNumber',
          title: information.labels.machine.ownerNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (answers: FormValue, externalData: ExternalData) => {
            const machine = getSelectedMachine(externalData, answers)
            return !!machine?.owner
          },
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            )
            return machine?.owner?.number || ''
          },
        }),
        buildTextField({
          id: 'machine.plate',
          title: information.labels.machine.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (answers: FormValue, externalData: ExternalData) => {
            const machine = getSelectedMachine(externalData, answers)
            return !!machine?.licensePlateNumber
          },
          defaultValue: (application: Application) => {
            const machine = getSelectedMachine(
              application.externalData,
              application.answers,
            )
            return machine?.licensePlateNumber || ''
          },
        }),
      ],
    }),
  ],
})
