import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { HomeApi } from '@island.is/clients/hms-rental-agreement'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class TerminateRentalAgreementService extends BaseTemplateApiService {
  constructor(private readonly homeApi: HomeApi) {
    super(ApplicationTypes.TERMINATE_RENTAL_AGREEMENT)
  }

  private homeApiWithAuth(auth: Auth) {
    return this.homeApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getRentalAgreements({ auth }: TemplateApiModuleActionProps) {
    return await this.homeApiWithAuth(auth).contractKtKtGet({
      kt: auth.nationalId,
    })

    // return [
    //   {
    //     id: 1,
    //     name: 'Leigusamningur 1',
    //     status: 'active',
    //   },
    //   {
    //     id: 2,
    //     name: 'Leigusamningur 2',
    //     status: 'active',
    //   },
    // ]
  }

  async createApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }

  async completeApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}
