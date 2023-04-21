import { buildSection } from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { PickApplicantSubSection } from './PickApplicantSubSection'
import { PermanentSubSection } from './PermanentSubSection'

export const ApplicantSection = buildSection({
  id: 'applicant',
  title: applicant.general.sectionTitle,
  children: [PickApplicantSubSection, PermanentSubSection],
})
