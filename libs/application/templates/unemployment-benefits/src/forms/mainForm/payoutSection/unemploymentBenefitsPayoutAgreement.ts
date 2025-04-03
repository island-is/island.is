import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const unemploymentBenefitsPayoutAgreementSubSection = buildSubSection({
  id: 'unemploymentBenefitsPayoutAgreementSubSection',
  title: 'unemploymentBenefitsPayoutAgreementSubSection',
  children: [
    buildMultiField({
      id: 'unemploymentBenefitsPayoutAgreementSubSection',
      title: payoutMessages.unemploymentBenefitsPayoutAgreement.pageTitle,
      description:
        payoutMessages.unemploymentBenefitsPayoutAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
