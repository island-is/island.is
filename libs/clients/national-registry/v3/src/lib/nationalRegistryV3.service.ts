import { Injectable } from '@nestjs/common'
import {
  EinstaklingarApi,
  EinstaklingurDTOAllt,
  GerviEinstaklingarApi,
} from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(
    private individualApi: EinstaklingarApi,
    private fakeApi: GerviEinstaklingarApi,
  ) {}

  async getData(nationalId: string): Promise<EinstaklingurDTOAllt> {
    return this.individualApi.midlunEinstaklingarNationalIdGet({ nationalId })
  }

  getGerviData(nationalId: string): Promise<EinstaklingurDTOAllt> {
    return this.fakeApi.midlunGerviEinstaklingarNationalIdGet({ nationalId })
  }
}
