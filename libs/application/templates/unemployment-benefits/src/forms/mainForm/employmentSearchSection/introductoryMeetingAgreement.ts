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

export const introductoryMeetingAgreementSubSection = buildSubSection({
  id: 'introductoryMeetingAgreementSubSection',
  title: employmentSearchMessages.introductoryMeetingAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'introductoryMeetingAgreementSubSection',
      title: employmentSearchMessages.introductoryMeetingAgreement.pageTitle,
      children: [
        buildCheckboxField({
          id: 'introductoryMeetingAgreement',
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
