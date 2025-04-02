import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const vacationSubSection = buildSubSection({
  id: 'vacationSubSection',
  title: 'vacationSubSection',
  children: [
    buildMultiField({
      id: 'vacationSubSection',
      title: payoutMessages.vacation.pageTitle,
      children: [],
    }),
  ],
})
