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
    private fakeIndividualApi: GerviEinstaklingarApi,
  ) {}

  private fetchData = (nationalId: string) =>
    process.env.API_MOCKS
      ? this.fakeIndividualApi.midlunV02GerviEinstaklingarNationalIdGet({
          nationalId,
        })
      : this.individualApi.midlunV02EinstaklingarNationalIdGet({ nationalId })

  getData = (nationalId: string): Promise<EinstaklingurDTOAllt> =>
    this.fetchData(nationalId)
}
