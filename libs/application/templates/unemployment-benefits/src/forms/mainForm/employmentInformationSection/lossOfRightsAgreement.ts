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

export const lossOfRightsAgreementSubSection = buildSubSection({
  id: 'lossOfRightsAgreementSubSection',
  title: employmentMessages.lossOfRightsAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'lossOfRightsAgreementSubSection',
      title: employmentMessages.lossOfRightsAgreement.pageTitle,
      description: employmentMessages.lossOfRightsAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'lossOfRightsAgreement',
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
