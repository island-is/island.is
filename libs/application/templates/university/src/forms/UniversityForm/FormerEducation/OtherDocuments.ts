import { buildSubSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const OtherDocumentsSection = buildSubSection({
  id: 'OtherDocuments',
  title: information.labels.otherDocumentsSection.sectionTitle,
  children: [],
})
