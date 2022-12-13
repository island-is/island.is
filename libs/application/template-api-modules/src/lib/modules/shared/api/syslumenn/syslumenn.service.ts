import { Injectable } from '@nestjs/common'
import {
  DistrictCommissionerAgencies,
  SyslumennService as SyslumennApiService,
} from '@island.is/clients/syslumenn'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class SyslumennService extends BaseTemplateApiService {
  constructor(private readonly syslumennService: SyslumennApiService) {
    super('Syslumenn')
  }

  async districtCommissioners(): Promise<DistrictCommissionerAgencies[]> {
    return await this.syslumennService.getDistrictCommissionersAgencies()
  }
}
