import { buildSection } from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const applicantInformationSection = buildSection({
  id: 'applicantInfoSection',
  title: m.applicantInfoSection,
  children: [applicantInformationMultiField()],
})
