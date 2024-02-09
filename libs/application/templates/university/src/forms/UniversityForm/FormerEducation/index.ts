import { buildSection } from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { EducationDetailsSubSection } from './EducationDetails'
import { EducationOptionsSubSection } from './EducationOptions'

export const FormerEducationSection = buildSection({
  id: 'formerEducation',
  title: formerEducation.general.sectionTitle,
  children: [EducationOptionsSubSection, EducationDetailsSubSection],
})
