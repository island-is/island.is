import { Application } from '@island.is/api/schema'
import { VehiclesCurrentVehicle } from '../../../types'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedVehicle } from '../../../utils'

export const plateSizeSubSection = buildSubSection({
  id: 'plateSize',
  title: information.labels.plateSize.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateSizeMultiField',
      title: information.labels.plateSize.title,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'plateSize.vehicleSubtitle',
          title: information.labels.plateSize.vehicleSubTitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'plateSize.vehiclePlate',
          title: information.labels.plateSize.vehiclePlate,
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
          id: 'plateSize.vehicleType',
          title: information.labels.plateSize.vehicleType,
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
        buildDescriptionField({
          id: 'plateSize.frontPlateSize.subtitle',
          title: information.labels.plateSize.frontPlateSubtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateSize.frontPlateSize',
          options: [
            {
              value: 'sizeA',
              label: information.labels.plateSize.frontPlateSizeAOptionTitle,
            },
            {
              value: 'sizeB',
              label: information.labels.plateSize.frontPlateSizeBOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildDescriptionField({
          id: 'plateSize.rearPlateSize.subtitle',
          title: information.labels.plateSize.rearPlateSubtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateSize.rearPlateSize',
          options: [
            {
              value: 'sizeA',
              label: information.labels.plateSize.rearPlateSizeAOptionTitle,
            },
            {
              value: 'sizeB',
              label: information.labels.plateSize.rearPlateSizeBOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
