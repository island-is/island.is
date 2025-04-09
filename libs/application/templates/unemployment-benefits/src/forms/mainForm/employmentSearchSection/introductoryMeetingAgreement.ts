import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const introductoryMeetingAgreementSubSection = buildSubSection({
  id: 'introductoryMeetingAgreementSubSection',
  title: employmentSearchMessages.introductoryMeetingAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'introductoryMeetingAgreementSubSection',
      title: employmentSearchMessages.introductoryMeetingAgreement.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
