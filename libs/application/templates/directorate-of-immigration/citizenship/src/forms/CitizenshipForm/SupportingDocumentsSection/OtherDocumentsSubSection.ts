import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'

export const OtherDocumentsSubSection = buildSubSection({
  id: 'otherDocuments',
  title: supportingDocuments.labels.otherDocuments.subSectionTitle,
  children: [
    buildMultiField({
      id: 'otherDocumentsMultiField',
      title: supportingDocuments.labels.otherDocuments.pageTitle,
      description: supportingDocuments.labels.otherDocuments.description,
      children: [
        buildDescriptionField({
          id: 'otherDocuments.title',
          title: supportingDocuments.labels.otherDocuments.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
