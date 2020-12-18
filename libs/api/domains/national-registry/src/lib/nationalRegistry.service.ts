import { Injectable } from '@nestjs/common'
import { FamilyMember, User, BanMarking } from './types'
import { NationalRegistryApi } from './soap/nationalRegistryApi'

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) {}

  getUserInfo(nationalId: User['nationalId']): Promise<User> {
    return this.nationalRegistryApi.getMyInfo(nationalId)
  }

  getFamily(nationalId: User['nationalId']): Promise<FamilyMember[]> {
    return this.nationalRegistryApi.getMyFamily(nationalId)
  }

  getReligion(nationalId: User['nationalId']): Promise<string> {
    return this.nationalRegistryApi.getReligion(nationalId)
  }

  getBirthPlace(municipalCode: User['municipalCode']): Promise<string> {
    return this.nationalRegistryApi.getBirthPlace(municipalCode)
  }

  getBanMarking(nationalId: User['nationalId']): Promise<BanMarking | null> {
    return this.nationalRegistryApi.getBanMarking(nationalId)
  }

  async getLegalResidence(houseCode: User['houseCode']): Promise<string> {
    const address = await this.nationalRegistryApi.getAddress(houseCode)
    if (!address) {
      return ''
    }
    return `${address.streetAddress}, ${address.postalCode} ${address.city}`
  }

  getAddress(houseCode: User['houseCode']) {
    return this.nationalRegistryApi.getAddress(houseCode)
  }
}
