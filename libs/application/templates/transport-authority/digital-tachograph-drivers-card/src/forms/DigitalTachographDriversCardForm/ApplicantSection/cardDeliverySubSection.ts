import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'

export const cardDeliverySubSection = buildSubSection({
  id: 'cardDelivery',
  title: applicant.labels.cardDelivery.subSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      description: applicant.labels.cardDelivery.description,
      children: [
        buildDescriptionField({
          id: 'cardDeliverySubtitle',
          title: applicant.labels.cardDelivery.pickDeliveryMethodLabel,
          titleVariant: 'h5',
        }),
        buildCustomField({
          id: 'cardDelivery',
          component: 'PickDeliveryMethod',
        }),
      ],
    }),
  ],
})
