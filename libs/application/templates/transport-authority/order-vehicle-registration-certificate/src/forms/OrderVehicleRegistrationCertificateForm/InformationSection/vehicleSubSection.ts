import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
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
          id: 'vehicle.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(application)
            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'vehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(application)
            return vehicle?.make
          },
        }),
        buildDescriptionField({
          id: 'owner.title',
          title: information.labels.owner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle({
              externalData,
              answers: formValue,
            } as Application)
            return vehicle?.role === 'Eigandi'
          },
        }),
        buildDescriptionField({
          id: 'coOwner.title',
          title: information.labels.coOwner.title,
          titleVariant: 'h5',
          space: 3,
          condition: (formValue, externalData) => {
            const vehicle = getSelectedVehicle({
              externalData,
              answers: formValue,
            } as Application)
            return vehicle?.role !== 'Eigandi'
          },
        }),
        buildTextField({
          id: 'owner.nationalId',
          title: information.labels.owner.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'owner.name',
          title: information.labels.owner.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'owner.email',
          title: information.labels.owner.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildTextField({
          id: 'owner.phone',
          title: information.labels.owner.phone,
          width: 'half',
          variant: 'tel',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
      ],
    }),
  ],
})
