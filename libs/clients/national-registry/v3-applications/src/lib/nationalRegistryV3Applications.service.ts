import { Injectable } from '@nestjs/common'

import { EinstaklingarApi } from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async get18YearOlds(): Promise<string[]> {
    return await this.individualApi.einstaklingar18IDagGet()
  }

  //getDomicileData(
  //  nationalId: string,
  //): Promise<EinstaklingurDTOLoghTengsl | null> {
  //  return handle204(
  //    this.individualApi.midlunV1EinstaklingarNationalIdLogheimilistengslGetRaw(
  //      {
  //        nationalId,
  //      },
  //    ),
  //  )
  //}
}
