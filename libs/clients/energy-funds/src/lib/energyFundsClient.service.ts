import { Injectable } from '@nestjs/common'
import {
  CatalogItem,
  DefaultApi,
  ElectricCarSubsidyPOST3Request,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import format from 'date-fns/format'

const importCodeList = {
  NEWCAR: ['2', '4'],
  USEDCAR: ['1'],
}

@Injectable()
export class EnergyFundsClientService {
  constructor(private defaultApi: DefaultApi) {}

  private defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCatalogItems(
    auth: User,
    vehicle: VehicleMiniDto,
  ): Promise<Array<CatalogItem>> {
    const response = await this.defaultApiWithAuth(auth).catalogGET1({
      registrationDate: format(
        new Date(vehicle.newRegistrationDate || ''),
        'yyyy-MM-dd',
      ),
      vehicleGroup: vehicle.vehicleRegistrationCode || '',
      firstRegDate: format(
        new Date(vehicle.firstRegistrationDate || ''),
        'yyyy-MM-dd',
      ),
    })

    return response.item || []
  }

  async checkVehicleSubsidyAvilability(
    auth: User,
    vinNumber: string,
  ): Promise<boolean> {
    const response = await this.defaultApiWithAuth(
      auth,
    ).gotElectricCarSubsidyvinNumberGET2({
      vinNumber: vinNumber,
    })

    return response.gotElectricCarSubsidyResult.gotSubsidy
  }

  async getCatalogValueForVehicle(auth: User, vehicle: VehicleMiniDto) {
    const catalogCodes = await this.getCatalogItems(auth, vehicle)
    return catalogCodes
  }

  async submitEnergyFundsApplication(
    auth: User,
    requestParameters: ElectricCarSubsidyPOST3Request,
  ) {
    await this.defaultApiWithAuth(auth).electricCarSubsidyPOST3(
      requestParameters,
    )
  }
}
