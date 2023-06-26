import { buildSection } from '@island.is/application/core'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { applicantInformation } from '../../lib/messages'

export const applicantInformationSection = buildSection({
  id: 'applicantInformationSection',
  title: applicantInformation.general.sectionTitle,
  children: [applicantInformationMultiField({ phoneRequired: true })],
})
