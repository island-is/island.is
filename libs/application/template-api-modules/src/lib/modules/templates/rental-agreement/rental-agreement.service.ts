import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { HomeApi } from '@island.is/clients/hms-rental-agreement'
import { applicationAnswers } from '@island.is/application/templates/rental-agreement'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { generateRentalAgreementEmail } from './rental-agreement-email'
import { mapRentalApplicationData } from './utils/mapRentalApplicationData'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly homeApi: HomeApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  private homeApiWithAuth(auth: Auth) {
    return this.homeApi.withMiddleware(new AuthMiddleware(auth))
  }

  async sendApplicationSummary({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateRentalAgreementEmail,
      application,
    )
    return
  }

  async submitApplicationToHmsRentalService({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application

    const mappedAnswers = applicationAnswers(answers)

    const leaseApplication = mapRentalApplicationData(
      id,
      applicant,
      mappedAnswers,
    )

    console.log(leaseApplication)

    return await this.homeApiWithAuth(auth)
      .contractPost({
        leaseApplication,
      })
      .catch((error) => {
        const errorMessage = `Error sending application ${id} to HMS Rental Service`
        console.error(errorMessage, error)

        throw new Error(`${errorMessage}: ${error.message || 'Unknown error'}`)
      })
  }
}
