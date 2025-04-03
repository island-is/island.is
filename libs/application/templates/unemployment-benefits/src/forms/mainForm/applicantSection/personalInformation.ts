import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'

export const personalInformationSubSection = buildSubSection({
  id: 'personalInformation',
  title: 'Personal information section',
  children: [
    buildMultiField({
      id: 'personalInformation',
      title: applicantMessages.personalInformation.pageTitle,
      description: applicantMessages.personalInformation.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
