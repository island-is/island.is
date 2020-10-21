import { Injectable } from '@nestjs/common';
import { FamilyMember } from './familyMember.model';
import { MyInfo } from './myInfo.model';
import { NationalRegistryApi } from './soap/nationalRegistryApi';

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) { }

  async GetMyinfo(nationalId: string): Promise<MyInfo | null> {
    return await this.nationalRegistryApi.getMyInfo(nationalId)
  }

  async GetMyFamily(nationalId: string): Promise<FamilyMember[] | null> {
    return await this.nationalRegistryApi.getMyFamily(nationalId)
  }
}
