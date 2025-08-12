import { buildSection } from '@island.is/application/core'
import { RentalHousingPropertyInfo } from './rentalHousingSubsections/rentalHousingPropertyInfo'
import { RentalHousingLandlordInfo } from './rentalHousingSubsections/rentalHousingLandlordInfo'
import { RentalHousingTenantInfo } from './rentalHousingSubsections/rentalHousingTenantInfo'
import { RentalHousingSpecialProvisions } from './rentalHousingSubsections/rentalHousingSpecialProvisions'
import { RentalHousingCondition } from './rentalHousingSubsections/rentalHousingCondition'
import { RentalHousingFireProtections } from './rentalHousingSubsections/rentalHousingFireProtections'

import { application } from '../../lib/messages'
import { RentalHousingPropertySearch } from './rentalHousingSubsections/rentalHousingPropertySearch'

export const RentalHousingSection = buildSection({
  id: 'rentalHousingSection',
  title: application.housingSectionName,
  children: [
    RentalHousingLandlordInfo,
    RentalHousingTenantInfo,
    RentalHousingPropertySearch,
    RentalHousingPropertyInfo,
    RentalHousingSpecialProvisions,
    RentalHousingCondition,
    RentalHousingFireProtections,
  ],
})
