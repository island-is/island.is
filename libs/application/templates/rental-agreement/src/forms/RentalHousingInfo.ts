import { buildSection } from '@island.is/application/core'

import { RentalHousingPropertyInfo } from './rentalHousingInfo/rentalHousingPropertyInfo'
import { RentalHousingLandlordInfo } from './rentalHousingInfo/rentalHousingLandlordInfo'
import { RentalHousingTenantInfo } from './rentalHousingInfo/rentalHousingTenantInfo'
import { RentalHousingSpecialProvisions } from './rentalHousingInfo/rentalHousingSpecialProvisions'
import { RentalHousingConditionInspection } from './rentalHousingInfo/rentalHousingConditionInspection'
import { RentalHousingFireProtections } from './rentalHousingInfo/rentalHousingFireProtections'

export const RentalHousingInfo = buildSection({
  id: 'rentalHousingInfo',
  title: 'Húsnæðið',
  children: [
    RentalHousingPropertyInfo,
    RentalHousingLandlordInfo,
    RentalHousingTenantInfo,
    RentalHousingSpecialProvisions,
    RentalHousingConditionInspection,
    RentalHousingFireProtections,
  ],
})
