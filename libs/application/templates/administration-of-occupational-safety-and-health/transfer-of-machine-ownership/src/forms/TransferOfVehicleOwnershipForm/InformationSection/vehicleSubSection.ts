import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildDateField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import {
  Machine,
  MachineDetails,
  VehiclesCurrentVehicle,
} from '../../../shared'
import { getSelectedVehicle } from '../../../utils'
import { gql, useQuery } from '@apollo/client'
import { GET_MACHINE_DETAILS } from '../../../graphql/queries'

const FetchMachineDetails = (currentVehicleId?: string) => {
  const { data, loading, error } = useQuery<MachineDetails>(
    gql(GET_MACHINE_DETAILS),
    {
      variables: {
        input: {
          id: currentVehicleId,
        },
      },
    },
  )

  if (!loading && !error) {
    return data // Return the data if available
  }

  return null // Return null if data is loading or an error occurred
}

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.title,
      description: information.labels.vehicle.description,
      children: [
        buildTextField({
          id: 'vehicle.registrationNumber',
          title: information.labels.vehicle.registrationNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            console.log('application', application)
            return machine.registrationNumber
          },
        }),
        buildTextField({
          id: 'vehicle.category',
          title: information.labels.vehicle.category,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine.category
          },
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine.type?.split(' - ')[0].trim()
          },
        }),
        buildTextField({
          id: 'vehicle.subType',
          title: information.labels.vehicle.subType,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return machine.type?.split(' - ')[1].trim()
          },
        }),
        buildTextField({
          id: 'vehicle.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            return 'plötunúmer'
          },
        }),
        buildTextField({
          id: 'vehicle.ownerNumber',
          title: information.labels.vehicle.ownerNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const machine = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as Machine
            console.log('machine-ID', machine.id)
            const machineDetails = FetchMachineDetails(machine.id)
            return machineDetails?.ownerNumber
          },
        }),
        buildDateField({
          id: 'vehicle.date',
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
