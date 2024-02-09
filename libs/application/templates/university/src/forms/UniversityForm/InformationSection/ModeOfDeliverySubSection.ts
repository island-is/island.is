import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const ModeOfDeliverySubSection = buildSubSection({
  id: Routes.MODEOFDELIVERYINFORMATION,
  title: information.labels.modeOfDeliverySection.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.MODEOFDELIVERYINFORMATION,
      title: information.labels.modeOfDeliverySection.title,
      description: information.labels.modeOfDeliverySection.subTitle,
      children: [
        buildCustomField({
          id: Routes.MODEOFDELIVERYINFORMATION,
          title: '',
          component: 'ModeOfDeliverySelection',
        }),
      ],
    }),
  ],
})
