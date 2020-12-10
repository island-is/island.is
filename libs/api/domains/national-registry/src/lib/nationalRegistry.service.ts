import { Injectable } from '@nestjs/common'
import { FamilyMember, User } from './types'
import { NationalRegistryApi } from './soap/nationalRegistryApi'
import { BanMarking } from './models/banMarking.model'

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

  getLegalResidence(houseCode: User['houseCode']): Promise<string> {
    return this.nationalRegistryApi.getLegalResidence(houseCode)
  }
}
