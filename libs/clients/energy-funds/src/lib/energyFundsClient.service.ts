import { Injectable } from '@nestjs/common'
import {
  CatalogItem,
  DefaultApi,
  ElectricCarSubsidyPOST3Request,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class EnergyFundsClientService {
  constructor(private api: DefaultApi) {}

  private applicationApiWithAuth(auth: Auth) {
    return this.api.withMiddleware(new AuthMiddleware(auth))
  }

  async getCatalogItems(auth: User): Promise<Array<CatalogItem>> {
    const response = await this.applicationApiWithAuth(auth).catalogGET1({
      registrationDate: new Date().toISOString(),
    })

    return response.item || []
  }

  async checkVehicleSubsidyAvilability(
    auth: User,
    vinNumber: string,
  ): Promise<boolean> {
    const response = await this.applicationApiWithAuth(
      auth,
    ).gotElectricCarSubsidyvinNumberGET2({
      vinNumber: vinNumber,
    })

    return response.gotElectricCarSubsidyResult.gotSubsidy
  }

  async submitEnergyFundsApplication(
    auth: User,
    requestParameters: ElectricCarSubsidyPOST3Request,
  ) {
    const response = await this.applicationApiWithAuth(
      auth,
    ).electricCarSubsidyPOST3(requestParameters)
  }
}
