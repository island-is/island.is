import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { generateRentalAgreementNotificationEmail } from './rental-agreement-email'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }
  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('APPLICATION', application)
    // await this.sharedTemplateAPIService.sendEmailWithAttachment(
    //   generateRentalAgreementNotificationEmail,
    //   application as unknown as Application,
    //   'rakel@kolibri.is',
    //   '',
    // )
    return
  }
}
