import { buildSection } from '@island.is/application/core'

import { RentalPeriodDetails } from './rentalPeriod/rentalPeriodDetails'
import { RentalPeriodAmount } from './rentalPeriod/rentalPeriodAmount'
import { RentalPeriodSecurityDeposit } from './rentalPeriod/rentalPeriodSecurityDeposit'
import { RentalPeriodOtherFees } from './rentalPeriod/rentalPeriodOtherFees'

import { application } from '../../lib/messages'

export const RentalPeriodSection = buildSection({
  id: 'rentalPeriodSection',
  title: application.rentalPeriodSectionName,
  children: [
    RentalPeriodDetails,
    RentalPeriodAmount,
    RentalPeriodSecurityDeposit,
    RentalPeriodOtherFees,
  ],
})
