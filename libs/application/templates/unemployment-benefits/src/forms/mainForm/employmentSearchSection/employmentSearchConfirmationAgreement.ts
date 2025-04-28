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

export const employmentSearchConfirmationAgreementSubSection = buildSubSection({
  id: 'employmentSearchConfirmationAgreementSubSection',
  title:
    employmentSearchMessages.employmentSearchConfirmationAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'employmentSearchConfirmationAgreementSubSection',
      title:
        employmentSearchMessages.employmentSearchConfirmationAgreement
          .pageTitle,
      description:
        employmentSearchMessages.employmentSearchConfirmationAgreement
          .pageDescription,
      children: [
        buildCheckboxField({
          id: 'employmentSearchConfirmationAgreement',
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
