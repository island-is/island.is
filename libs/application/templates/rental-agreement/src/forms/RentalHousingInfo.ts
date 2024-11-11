import { buildSection } from '@island.is/application/core'
import { RentalHousingPropertyInfo } from './rentalHousingInfo/rentalHousingPropertyInfo'
import { RentalHousingLandlordInfo } from './rentalHousingInfo/rentalHousingLandlordInfo'
import { RentalHousingTenantInfo } from './rentalHousingInfo/rentalHousingTenantInfo'
import { RentalHousingSpecialProvisions } from './rentalHousingInfo/rentalHousingSpecialProvisions'
import { RentalHousingCondition } from './rentalHousingInfo/rentalHousingCondition'
import { RentalHousingFireProtections } from './rentalHousingInfo/rentalHousingFireProtections'

import { application } from '../lib/messages'

export const RentalHousingInfo = buildSection({
  id: 'rentalHousingInfo',
  title: application.housingSectionName,
  children: [
    RentalHousingPropertyInfo,
    RentalHousingLandlordInfo,
    RentalHousingTenantInfo,
    RentalHousingSpecialProvisions,
    RentalHousingCondition,
    RentalHousingFireProtections,
  ],
})
