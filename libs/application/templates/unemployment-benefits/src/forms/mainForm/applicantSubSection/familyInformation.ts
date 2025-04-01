import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'

export const familyInformationSubSection = buildSubSection({
  id: 'familyInformationSubSection',
  title: 'Family information section',
  children: [
    buildMultiField({
      id: 'familyInformationSubSection',
      title: applicantMessages.familyInformation.pageTitle,
      children: [],
    }),
  ],
})
