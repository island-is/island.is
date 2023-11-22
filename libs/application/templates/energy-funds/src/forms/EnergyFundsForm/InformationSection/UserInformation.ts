import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildDateField,
} from '@island.is/application/core'
import format from 'date-fns/format'

import { information } from '../../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../../shared/types'
import { getSelectedVehicle } from '../../../utils'

export const userInformationSubSection = buildSubSection({
  id: 'vehicle',
  title: information.labels.vehicle.sectionTitle,
  children: [
    buildMultiField({
      id: 'vehicleMultiField',
      title: information.labels.vehicle.pageTitle,
      description: information.labels.vehicle.description,
      children: [
        buildDescriptionField({
          id: 'vehicle.title',
          title: information.labels.vehicle.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'selectVehicle.plate',
          title: information.labels.vehicle.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle

            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'selectVehicle.type',
          title: information.labels.vehicle.type,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle?.make
          },
        }),
        buildTextField({
          id: 'vehicleDetails.price',
          title: information.labels.vehicle.price,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'currency',
          required: true,
        }),
        buildTextField({
          id: 'vehicleDetails.registrationDate',
          title: information.labels.vehicle.registrationDate,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return (
              vehicle.registrationDate &&
              format(new Date(vehicle.registrationDate), 'dd.MM.yyyy')
            )
          },
        }),
        buildDescriptionField({
          id: 'seller.mainSeller',
          title: information.labels.applicant.description,
          titleVariant: 'h5',
          space: 'gutter',
        }),
        buildTextField({
          id: 'seller.name',
          title: information.labels.applicant.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            `${application.externalData?.individual?.data?.givenName} ${application.externalData?.individual?.data?.familyName}`,
        }),
        buildTextField({
          id: 'seller.nationalId',
          title: information.labels.applicant.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.individual?.data?.nationalId,
        }),
        buildTextField({
          id: 'seller.email',
          title: information.labels.applicant.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildTextField({
          id: 'seller.phone',
          title: information.labels.applicant.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
      ],
    }),
  ],
})
