import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { PassportsService } from '@island.is/clients/passports'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { PassportAnnulmentAnswers } from './constants'

@Injectable()
export class PassportAnnulmentService extends BaseTemplateApiService {
  constructor(private passportApi: PassportsService) {
    super(ApplicationTypes.PASSPORT_ANNULMENT)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
  }> {
    const { status, comment, productionRequestID } =
      application.answers as PassportAnnulmentAnswers
    const result = await this.passportApi.annulPassport(auth, {
      status,
      comment,
      productionRequestId: productionRequestID,
    })
    return result
  }
}
