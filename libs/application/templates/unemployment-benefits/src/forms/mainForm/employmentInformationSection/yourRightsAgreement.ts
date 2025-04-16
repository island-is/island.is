import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const yourRightsAgreementSubSection = buildSubSection({
  id: 'yourRightsAgreementSubSection',
  title: employmentMessages.yourRightsAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'yourRightsAgreementSubSection',
      title: employmentMessages.yourRightsAgreement.pageTitle,
      description: employmentMessages.yourRightsAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'yourRightsAgreement',
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
