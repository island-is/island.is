import {
  buildCustomField,
  buildDescriptionField,
  buildSubSection,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const OtherDocumentsSection = buildSubSection({
  id: Routes.OTHERDOCUMENTS,
  title: information.labels.otherDocumentsSection.sectionTitle,
  children: [
    buildDescriptionField({
      id: 'OtherDocuments.description',
      title: information.labels.otherDocumentsSection.title,
      description: information.labels.otherDocumentsSection.subTitle,
    }),
    buildCustomField({
      id: Routes.OTHERDOCUMENTS,
      title: '',
      component: 'OtherDocuments',
    }),
  ],
})
