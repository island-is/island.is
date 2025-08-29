import { buildSection } from '@island.is/application/core'
import { RentalHousingPropertyInfo } from './rentalHousingSubsections/rentalHousingPropertyInfo'

import { RentalHousingSpecialProvisions } from './rentalHousingSubsections/rentalHousingSpecialProvisions'
import { RentalHousingCondition } from './rentalHousingSubsections/rentalHousingCondition'
import { RentalHousingFireProtections } from './rentalHousingSubsections/rentalHousingFireProtections'

import { application } from '../../lib/messages'
import { RentalHousingPropertySearch } from './rentalHousingSubsections/rentalHousingPropertySearch'
import { RentalHousingPartiesInfo } from './rentalHousingSubsections/rentalHousingPartiesInfo'

export const RentalHousingSection = buildSection({
  id: 'rentalHousingSection',
  title: application.housingSectionName,
  children: [
    RentalHousingPartiesInfo,
    RentalHousingPropertySearch,
    RentalHousingPropertyInfo,
    RentalHousingSpecialProvisions,
    RentalHousingCondition,
    RentalHousingFireProtections,
  ],
})
