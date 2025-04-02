import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const capitalIncomeSubSection = buildSubSection({
  id: 'capitalIncomeSubSection',
  title: 'capitalIncomeSubSection',
  children: [
    buildMultiField({
      id: 'capitalIncomeSubSection',
      title: payoutMessages.capitalIncome.pageTitle,
      children: [],
    }),
  ],
})
