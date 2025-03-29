import { buildSection } from '@island.is/application/core'
import { RentalHousingPropertyInfo } from './rentalHousing/rentalHousingPropertyInfo'
import { RentalHousingLandlordInfo } from './rentalHousing/rentalHousingLandlordInfo'
import { RentalHousingTenantInfo } from './rentalHousing/rentalHousingTenantInfo'
import { RentalHousingSpecialProvisions } from './rentalHousing/rentalHousingSpecialProvisions'
import { RentalHousingCondition } from './rentalHousing/rentalHousingCondition'
import { RentalHousingFireProtections } from './rentalHousing/rentalHousingFireProtections'

import { application } from '../../lib/messages'

export const RentalHousingSection = buildSection({
  id: 'rentalHousingSection',
  title: application.housingSectionName,
  children: [
    RentalHousingLandlordInfo,
    RentalHousingTenantInfo,
    RentalHousingPropertyInfo,
    RentalHousingSpecialProvisions,
    RentalHousingCondition,
    RentalHousingFireProtections,
  ],
})
