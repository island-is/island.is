import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { coreErrorMessages } from '@island.is/application/core'

import { PassportsService } from '@island.is/clients/passports'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'

@Injectable()
export class PassportService extends BaseTemplateApiService {
  constructor(private passportApi: PassportsService) {
    super('IdentityDocument')
  }

  async identityDocument({ application, auth }: TemplateApiModuleActionProps) {
    const identityDocument = await this.passportApi.getCurrentPassport(auth)
    if (!identityDocument) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.failedDataProvider,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
    return identityDocument
  }
}
