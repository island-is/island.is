import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'

export const supportingDocumentsSection = buildSection({
  id: 'supportingDocumentsSection',
  title: supportingDocuments.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'supportingDocumentsMultiField',
      title: supportingDocuments.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'TODOx lorem ipsum',
        }),
      ],
    }),
  ],
})
