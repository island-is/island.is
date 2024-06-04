import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import { coreErrorMessages } from '@island.is/application/core'

import { PassportsService } from '@island.is/clients/passports'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { PassportsParameters } from '@island.is/application/types'

@Injectable()
export class PassportService extends BaseTemplateApiService {
  constructor(private passportApi: PassportsService) {
    super('IdentityDocument')
  }

  async identityDocument({
    application,
    auth,
    params,
  }: TemplateApiModuleActionProps<PassportsParameters>) {
    console.log('how about here??', params)
    const identityDocument = await this.passportApi.getCurrentPassport(
      auth,
      params?.type,
    )
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
