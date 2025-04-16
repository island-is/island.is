import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  employmentSearch as employmentSearchMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const interviewAndMeetingAgreementSubSection = buildSubSection({
  id: 'interviewAndMeetingAgreementSubSection',
  title: employmentSearchMessages.interviewAndMeetingAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'interviewAndMeetingAgreementSubSection',
      title: employmentSearchMessages.interviewAndMeetingAgreement.pageTitle,
      children: [
        buildCheckboxField({
          id: 'interviewAndMeetingAgreement',
          backgroundColor: 'blue',
          large: true,
          options: [
            {
              value: YES,
              label: applicationMessages.agreeCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
