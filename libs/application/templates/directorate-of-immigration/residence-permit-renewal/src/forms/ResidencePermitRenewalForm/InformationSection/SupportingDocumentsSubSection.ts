import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const SupportingDocumentsSubSection = buildSubSection({
  id: 'supportingDocuments',
  title: information.labels.supportingDocuments.subSectionTitle,
  children: [
    buildMultiField({
      id: 'supportingDocumentsMultiField',
      title: information.labels.supportingDocuments.pageTitle,
      description: information.labels.supportingDocuments.description,
      children: [
        buildDescriptionField({
          id: 'supportingDocuments.title',
          title: information.labels.supportingDocuments.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
