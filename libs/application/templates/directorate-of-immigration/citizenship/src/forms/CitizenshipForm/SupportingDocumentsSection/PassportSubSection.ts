import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'

export const PassportSubSection = buildSubSection({
  id: 'passport',
  title: supportingDocuments.labels.passport.subSectionTitle,
  children: [
    buildMultiField({
      id: 'passportMultiField',
      title: supportingDocuments.labels.passport.pageTitle,
      description: supportingDocuments.labels.passport.description,
      children: [
        buildDescriptionField({
          id: 'passport.title',
          title: supportingDocuments.labels.passport.title,
          titleVariant: 'h5',
        }),
      ],
    }),
  ],
})
