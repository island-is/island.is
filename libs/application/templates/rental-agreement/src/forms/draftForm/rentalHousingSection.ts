import { buildSection } from '@island.is/application/core'
import { RentalHousingPropertyInfo } from './rentalHousingSubsections/rentalHousingPropertyInfo'
import { RentalHousingSpecialProvisions } from './rentalHousingSubsections/rentalHousingSpecialProvisions'
import { RentalHousingCondition } from './rentalHousingSubsections/rentalHousingCondition'
import { RentalHousingFireProtections } from './rentalHousingSubsections/rentalHousingFireProtections'
import { RentalHousingPropertySearch } from './rentalHousingSubsections/rentalHousingPropertySearch'
import * as m from '../../lib/messages'

export const RentalHousingSection = buildSection({
  id: 'rentalHousingSection',
  title: m.application.housingSectionName,
  children: [
    RentalHousingPropertySearch,
    RentalHousingPropertyInfo,
    RentalHousingSpecialProvisions,
    RentalHousingCondition,
    RentalHousingFireProtections,
  ],
})
