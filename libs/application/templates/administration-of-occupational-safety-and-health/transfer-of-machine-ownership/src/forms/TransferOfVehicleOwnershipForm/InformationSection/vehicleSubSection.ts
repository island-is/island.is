import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildDateField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Machine } from '../../../shared'
import { getSelectedVehicle } from '../../../utils'

export const vehicleSubSection = buildSubSection({
  id: 'machine',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'machineMultiField',
      title: information.labels.vehicle.title,
      description: information.labels.vehicle.description,
      children: [
        buildTextField({
          id: 'machine.regNumber',
          title: information.labels.vehicle.registrationNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.registrationNumber
          },
        }),
        buildTextField({
          id: 'machine.category',
          title: information.labels.vehicle.category,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.category
          },
        }),
        buildTextField({
          id: 'machine.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.type?.split(' - ')[0].trim() || ''
          },
        }),
        buildTextField({
          id: 'machine.subType',
          title: information.labels.vehicle.subType,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.type?.split(' - ')[1].trim() || ''
          },
        }),
        buildTextField({
          id: 'machine.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.licensePlateNumber
          },
        }),
        buildTextField({
          id: 'machine.ownerNumber',
          title: information.labels.vehicle.ownerNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine?.ownerNumber
          },
        }),
        buildDateField({
          id: 'machine.date',
          title: information.labels.vehicle.date,
          required: true,
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
