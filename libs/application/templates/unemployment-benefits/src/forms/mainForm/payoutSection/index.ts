import { buildSection } from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import { payoutInformationSubSection } from './payoutInformation'
import { taxDiscountSubSection } from './taxDiscount'
import { vacationSubSection } from './vacation'
import { vacationsAndForeginWorkAgreementSubSection } from './vacationsAndForeignWorkAgreement'
import { otherBenefitsSubSection } from './otherBenefits'
import { capitalIncomeSubSection } from './capitalIncome'
import { unemploymentBenefitsPayoutAgreementSubSection } from './unemploymentBenefitsPayoutAgreement'

export const payoutSection = buildSection({
  id: 'payoutSection',
  title: payoutMessages.general.sectionTitle,
  children: [
    payoutInformationSubSection,
    taxDiscountSubSection,
    vacationSubSection,
    vacationsAndForeginWorkAgreementSubSection,
    otherBenefitsSubSection,
    capitalIncomeSubSection,
    unemploymentBenefitsPayoutAgreementSubSection,
  ],
})
