import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'

export const familyInformationSubSection = buildSubSection({
  id: 'familyInformationSubSection',
  title: applicantMessages.familyInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'familyInformationSubSection',
      title: applicantMessages.familyInformation.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
