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
          id: 'vehicleInfo.plate',
          title: information.labels.plateSize.vehiclePlate,
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
          title: information.labels.plateSize.vehicleType,
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
          id: 'plateSize',
          component: 'PickPlateSize',
        }),
      ],
    }),
  ],
})
