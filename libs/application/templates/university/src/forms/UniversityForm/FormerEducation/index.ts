import { buildSection } from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { EducationDetailsSubSection } from './EducationDetails'
import { OtherDocumentsSubSection } from './OtherDocuments'

export const FormerEducationSection = buildSection({
  id: 'formerEducation',
  title: formerEducation.general.sectionTitle,
  children: [EducationDetailsSubSection, OtherDocumentsSubSection],
})
