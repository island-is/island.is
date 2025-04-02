import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const vacationsAndForeginWorkAgreementSubSection = buildSubSection({
  id: 'vacationsAndForeginWorkAgreementSubSection',
  title: 'vacationsAndForeginWorkAgreementSubSection',
  children: [
    buildMultiField({
      id: 'vacationsAndForeginWorkAgreementSubSection',
      title: payoutMessages.vacationsAndForeignWorkAgreement.pageTitle,
      description:
        payoutMessages.vacationsAndForeignWorkAgreement.pageDescription,
      children: [],
    }),
  ],
})
