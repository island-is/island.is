import { buildSection } from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { applicantSubSection } from './applicantSubSection'
import { contactSubSection } from './contactSubSection'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [applicantSubSection, contactSubSection],
})
