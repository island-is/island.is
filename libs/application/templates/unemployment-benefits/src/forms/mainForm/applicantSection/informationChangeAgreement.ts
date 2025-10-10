import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  applicant as applicantMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const informationChangeAgreementSubSection = buildSubSection({
  id: 'informationChangeAgreementSubSection',
  title: applicantMessages.informationChangeAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'informationChangeAgreementSubSection',
      title: applicantMessages.informationChangeAgreement.pageTitle,
      description: applicantMessages.informationChangeAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'informationChangeAgreement',
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
