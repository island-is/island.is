import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const interviewAndMeetingAgreementSubSection = buildSubSection({
  id: 'interviewAndMeetingAgreementSubSection',
  title: employmentSearchMessages.interviewAndMeetingAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'interviewAndMeetingAgreementSubSection',
      title: employmentSearchMessages.interviewAndMeetingAgreement.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
