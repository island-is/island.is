import { Application } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../lib/dataSchema'
import { NationalRegistryIndividual } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'

export type GrindavikHousingBuyoutExternalData = {
  nationalRegistry: { data: NationalRegistryIndividual; date: string }
  userProfile: {
    data: { bankInfo: string; email: string; mobilePhoneNumber: string }
    date: string
  }
  getGrindavikHousing: { data: Fasteign; date: string }
  checkResidence: { data: { realEstateId: string }; date: string }
}

export type GrindavikHousingBuyoutApplication =
  Application<GrindavikHousingBuyout> & {
    externalData: GrindavikHousingBuyoutExternalData
  }
