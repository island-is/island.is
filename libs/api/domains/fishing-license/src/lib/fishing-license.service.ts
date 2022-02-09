import { Inject, Injectable } from '@nestjs/common'
import {
  FISHING_LICENSE_CLIENT,
  FishingLicenseClient,
} from '@island.is/clients/fishing-licence'

@Injectable()
export class FishingLicenseService {
  constructor(
    @Inject(FISHING_LICENSE_CLIENT)
    private fishingLicenseApi: FishingLicenseClient,
  ) {}

  async getShips(nationalId: string) {
    return this.fishingLicenseApi.getShips(nationalId)
  }

  async getFishingLicences(shipRegistationNumber: number) {
    return this.fishingLicenseApi.getFishingLicenses(shipRegistationNumber)
  }

  //Todo fishingLicense type
  async createFishingLicense(fishingLicense: any) {
    console.log('🐟🐠🦈🎣')
  }
}
