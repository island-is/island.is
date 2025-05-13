import { buildSection } from '@island.is/application/core'

import { RentalPeriodDetails } from './rentalPeriodSubsections/rentalPeriodDetails'
import { RentalPeriodAmount } from './rentalPeriodSubsections/rentalPeriodAmount'
import { RentalPeriodSecurityDeposit } from './rentalPeriodSubsections/rentalPeriodSecurityDeposit'
import { RentalPeriodOtherFees } from './rentalPeriodSubsections/rentalPeriodOtherFees'

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
