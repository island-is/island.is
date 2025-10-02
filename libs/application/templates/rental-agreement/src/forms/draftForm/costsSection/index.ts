import { buildSection } from '@island.is/application/core'
import { rentalAmountSubsection } from './rentalAmountSubsection'
import { securityDepositSubsection } from './securityDepositSubsection'
import { otherFeesSubsection } from './otherFeesSubsection'
import * as m from '../../../lib/messages'

export const costsSection = buildSection({
  id: 'costsSection',
  title: m.cost.sectionTitle,
  children: [
    rentalAmountSubsection,
    securityDepositSubsection,
    otherFeesSubsection,
  ],
})
