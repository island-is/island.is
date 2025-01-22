import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildHiddenInput,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedVehicle } from '../../../utils'

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.title,
      children: [
        buildTextField({
          id: 'vehicleInfo.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'vehicleInfo.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.make
          },
        }),
        buildHiddenInput({
          id: 'vehicleMileage.requireMileage',
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.requireMileage || false
          },
        }),
        buildHiddenInput({
          id: 'vehicleMileage.mileageReading',
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.mileageReading || ''
          },
        }),
        buildTextField({
          id: 'vehicleMileage.value',
          title: information.labels.vehicle.mileage,
          width: 'full',
          variant: 'number',
          required: true,
          condition: (answers, externalData) => {
            const vehicle = getSelectedVehicle(externalData, answers)
            return vehicle?.requireMileage || false
          },
          placeholder(application) {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.mileageReading
              ? `Síðasta skráning ${vehicle.mileageReading} Km`
              : ''
          },
        }),
      ],
    }),
  ],
})
