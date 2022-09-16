import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { HasTeachingRights } from '@island.is/application/types'

@Injectable()
export class DrivingLicenseProviderService extends BaseTemplateApiService {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {
    super('DrivingLicense')
  }

  // Teaching Rights
  async getHasTeachingRights({ auth }: TemplateApiModuleActionProps) {
    console.log('in here')
    const data = this.drivingLicenseService.getTeachingRights(auth.nationalId)
    console.log('DATA', data)
    return data
  }

  // Current License

  // Has Quality Photo

  // Has Quality Signature

  // Juristiction
}
