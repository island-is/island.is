import { Injectable } from '@nestjs/common'
import {
  CatalogItem,
  DefaultApi,
  ElectricCarSubsidyPOST3Request,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'

const importCodeList = {
  NEWCAR: ['2', '4'],
  USEDCAR: ['1'],
}

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

  async getCatalogValueForVehicle(auth: User, vehicle: VehicleMiniDto) {
    const catalogCodes = await this.getCatalogItems(auth)

    //TODO CHANGE YEAR
    const cutOffDate = new Date(2021, 0, 1)

    const importCode = vehicle.importCode || ''
    const vehicleRegistrationCode = vehicle.vehicleRegistrationCode
    const newRegistrationDate =
      vehicle.newRegistrationDate && new Date(vehicle.newRegistrationDate)
    const firstRegistrationDate =
      vehicle.firstRegistrationDate && new Date(vehicle.firstRegistrationDate)

    const oneYearAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    )

    if (vehicleRegistrationCode === 'M1') {
      if (
        importCodeList.NEWCAR.indexOf(importCode) !== -1 &&
        newRegistrationDate &&
        newRegistrationDate >= cutOffDate
      ) {
        return catalogCodes.find((x) => x.itemCode === 'M1NEW')
      } else if (
        importCodeList.USEDCAR.indexOf(importCode) !== -1 &&
        firstRegistrationDate &&
        firstRegistrationDate >= oneYearAgo &&
        newRegistrationDate &&
        newRegistrationDate >= cutOffDate
      ) {
        return catalogCodes.find((x) => x.itemCode === 'M1USE')
      }
    } else if (vehicleRegistrationCode === 'N1') {
      if (
        importCodeList.NEWCAR.indexOf(importCode) !== -1 &&
        newRegistrationDate &&
        newRegistrationDate >= cutOffDate
      ) {
        return catalogCodes.find((x) => x.itemCode === 'N1NEW')
      } else if (
        importCodeList.USEDCAR.indexOf(importCode) !== -1 &&
        firstRegistrationDate &&
        firstRegistrationDate >= oneYearAgo &&
        newRegistrationDate &&
        newRegistrationDate >= cutOffDate
      ) {
        return catalogCodes.find((x) => x.itemCode === 'N1USE')
      }
    }
  }

  async submitEnergyFundsApplication(
    auth: User,
    requestParameters: ElectricCarSubsidyPOST3Request,
  ) {
    await this.applicationApiWithAuth(auth).electricCarSubsidyPOST3(
      requestParameters,
    )
  }
}
