import { buildSubSection, buildMultiField } from '@island.is/application/core'
import { plateDelivery } from '../../../lib/messages/plateDelivery'

export const plateDeliverySubSection = buildSubSection({
  id: 'licencePlateSubSection',
  title: plateDelivery.general.title,
  children: [
    buildMultiField({
      id: 'licencePlate',
      title: plateDelivery.general.title,
      description: plateDelivery.general.description,
      children: [],
    }),
  ],
})
