import { Injectable } from '@nestjs/common';
import { MyInfo } from './myInfo.model';
import { NationalRegistryApi } from './soap/nationalRegistryApi';

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) { }

  async GetMyinfo(nationalId: string): Promise<MyInfo | null> {
    console.log('getmyinof')
    const result = await this.nationalRegistryApi.getMyInfo(nationalId)
    console.log(result?.table.diffgram.DocumentElement.Thjodskra.Nafn)
    return null
  }
}
