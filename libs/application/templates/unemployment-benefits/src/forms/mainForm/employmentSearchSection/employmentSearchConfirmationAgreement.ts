import {
  buildCheckboxField,
  buildCustomField,
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
        //This is currently the last acknowledgment field in the application, if there is one added after this one, this logic needs to be moved to there and new ackowledgement field added to submit
        buildCustomField({
          id: 'employmentSearchConfirmationAgreement.addAcknowledgementFields',
          component: 'AcknowledgementChecksUpdate',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
