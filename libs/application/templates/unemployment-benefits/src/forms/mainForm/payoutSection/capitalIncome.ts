import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const capitalIncomeSubSection = buildSubSection({
  id: 'capitalIncomeSubSection',
  title: payoutMessages.capitalIncome.sectionTitle,
  children: [
    buildMultiField({
      id: 'capitalIncomeSubSection',
      title: payoutMessages.capitalIncome.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
