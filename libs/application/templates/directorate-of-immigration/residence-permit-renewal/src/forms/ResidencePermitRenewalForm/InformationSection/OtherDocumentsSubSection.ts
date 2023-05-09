import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const OtherDocumentsSubSection = buildSubSection({
  id: 'otherDocuments',
  title: information.labels.otherDocuments.subSectionTitle,
  children: [
    buildMultiField({
      id: 'otherDocumentsMultiField',
      title: information.labels.otherDocuments.pageTitle,
      description: information.labels.otherDocuments.description,
      children: [
        buildDescriptionField({
          id: 'otherDocuments.title',
          title: information.labels.otherDocuments.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
