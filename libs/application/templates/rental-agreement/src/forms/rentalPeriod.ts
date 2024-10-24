import { buildSection } from '@island.is/application/core'

import { RentalPeriodDetails } from './rentalPeriod/rentalPeriodDetails'
import { RentalPeriodAmount } from './rentalPeriod/rentalPeriodAmount'
import { RentalPeriodSecurityDeposit } from './rentalPeriod/rentalPeriodSecurityDeposit'
import { RentalPeriodOtherFees } from './rentalPeriod/rentalPeriodOtherFees'

export const RentalPeriod = buildSection({
  id: 'rentalPeriod',
  title: 'Tímabil og verð',
  children: [
    RentalPeriodDetails,
    RentalPeriodAmount,
    RentalPeriodSecurityDeposit,
    RentalPeriodOtherFees,
  ],
})
