import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedVehicle } from '../../../utils'

export const vehicleSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.pageTitle,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: information.labels.vehicle.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'vehicleInfo.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
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
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            )
            return vehicle?.make
          },
        }),
        buildCustomField({
          id: 'mainOwner',
          component: 'MainOwner',
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role !== 'Eigandi'
          },
        }),
        buildDescriptionField({
          id: 'owner.title',
          title: information.labels.owner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
        }),
        buildDescriptionField({
          id: 'coOwner.title',
          title: information.labels.coOwner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role !== 'Eigandi'
          },
        }),
        buildTextField({
          id: 'owner.name',
          title: information.labels.owner.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.name,
        }),
        buildTextField({
          id: 'owner.nationalId',
          title: information.labels.owner.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'owner.address',
          title: information.labels.owner.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.address?.streetAddress,
        }),
        buildTextField({
          id: 'owner.postalCode',
          title: information.labels.owner.postalcode,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle(externalData, formValue)
            return vehicle?.role === 'Eigandi'
          },
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.address?.postalCode,
        }),
      ],
    }),
  ],
})
