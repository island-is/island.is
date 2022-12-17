import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedVehicle } from '../../../utils'

export const plateDeliverySubSection = buildSubSection({
  id: 'plateDelivery',
  title: information.labels.plateDelivery.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateDeliveryMultiField',
      title: information.labels.plateDelivery.title,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'plateDelivery.deliveryType.subTitle',
          title: information.labels.plateDelivery.subTitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateDelivery.deliveryType',
          options: [
            {
              value: 'transportAuthority',
              label:
                information.labels.plateDelivery.transportAuthorityOptionTitle,
            },
            {
              value: 'deliveryStation',
              label:
                information.labels.plateDelivery.deliveryStationOptionTitle,
            },
          ],
          width: 'half',
          largeButtons: true,
        }),
        //TODOx deliverystation list
        //TODOx checkbox rush fee
      ],
    }),
  ],
})
