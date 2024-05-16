import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { DisabilityLicenseService } from '@island.is/clients/disability-license'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class DisabilityLicenseApiService extends BaseTemplateApiService {
  constructor(
    private readonly disabilityLicenseClient: DisabilityLicenseService,
  ) {
    super('DisabilityLicenseShared')
  }

  async hasDisability({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<boolean | null> {
    let res
    try {
      res = await this.disabilityLicenseClient.hasDisabilityLicense(auth)
    } catch (e) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    return res
  }
}
