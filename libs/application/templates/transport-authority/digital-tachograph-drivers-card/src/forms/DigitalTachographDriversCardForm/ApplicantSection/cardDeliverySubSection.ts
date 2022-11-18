import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { Application } from '../../../types/schema'

export const cardDeliverySubSection = buildSubSection({
  id: 'cardDelivery',
  title: applicant.labels.cardDelivery.subSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'applicant.title',
          title: 'Hello world!',
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
