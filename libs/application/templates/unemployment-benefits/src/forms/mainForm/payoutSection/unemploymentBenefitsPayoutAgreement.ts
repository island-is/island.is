import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  payout as payoutMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const unemploymentBenefitsPayoutAgreementSubSection = buildSubSection({
  id: 'unemploymentBenefitsPayoutAgreementSubSection',
  title: payoutMessages.unemploymentBenefitsPayoutAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'unemploymentBenefitsPayoutAgreementSubSection',
      title: payoutMessages.unemploymentBenefitsPayoutAgreement.pageTitle,
      description:
        payoutMessages.unemploymentBenefitsPayoutAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'unemploymentBenefitsPayoutAgreement',
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
