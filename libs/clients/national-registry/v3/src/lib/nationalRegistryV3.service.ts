import { Injectable } from '@nestjs/common'
import { EinstaklingarApi, EinstaklingurDTOAllt } from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async getData(nationalId: string): Promise<EinstaklingurDTOAllt> {
    return this.individualApi.midlunV02EinstaklingarNationalIdGet({
      nationalId,
    })
  }
}
