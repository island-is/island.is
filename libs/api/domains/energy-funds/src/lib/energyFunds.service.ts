import { Injectable } from '@nestjs/common'
import { EnergyFundsClientService } from '@island.is/clients/energy-funds'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'

@Injectable()
export class EnergyFundsApi {
  constructor(
    private readonly energyFundsClientService: EnergyFundsClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private async getCatalogItems(auth: User) {
    return await this.energyFundsClientService.getCatalogItems(auth)
  }

  private getVehicleGrant = async (auth: User, vehicle: VehicleMiniDto) => {
    const catalogCodes = await this.getCatalogItems(auth)
    console.log('catalogCodes', catalogCodes)
    const importCode = vehicle.importCode
    const vehicleRegistrationCode = vehicle.vehicleRegistrationCode
    const newRegistrationDate = vehicle.newRegistrationDate
      ? new Date(vehicle.newRegistrationDate)
      : ''
    const firstRegistrationDate = vehicle.firstRegistrationDate
      ? new Date(vehicle.firstRegistrationDate)
      : ''

    const oneYearAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    )

    if (vehicleRegistrationCode === 'M1') {
      if (
        (importCode === '2' || importCode === '4') &&
        newRegistrationDate >= new Date(2021, 0, 1)
      ) {
        return catalogCodes.find((x) => x.itemCode === 'M1NEW')
      } else if (
        importCode === '1' &&
        firstRegistrationDate >= oneYearAgo &&
        newRegistrationDate >= new Date(2021, 0, 1)
      ) {
        return catalogCodes.find((x) => x.itemCode === 'M1USE')
      }
    } else if (vehicleRegistrationCode === 'N1') {
      if (
        (importCode === '2' || importCode === '4') &&
        newRegistrationDate >= new Date(2021, 0, 1)
      ) {
        return catalogCodes.find((x) => x.itemCode === 'N1NEW')
      } else if (
        importCode === '1' &&
        firstRegistrationDate >= oneYearAgo &&
        newRegistrationDate >= new Date(2021, 0, 1)
      ) {
        return catalogCodes.find((x) => x.itemCode === 'N1USE')
      }
    }
  }

  async getVehicleDetails(auth: User, vin: string) {
    const results = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    const currentVehicle = results?.find(
      (vehicle: VehicleMiniDto) => vehicle.vin === vin,
    )

    if (!currentVehicle) {
      throw Error(
        'Did not find the vehicle with for that vin, or you are neither owner nor co-owner of the vehicle',
      )
    }

    let vehicleGrant
    let vehicleGrantItemCode

    if (currentVehicle) {
      const vehicleGrantItem = await this.getVehicleGrant(auth, currentVehicle)
      vehicleGrant = vehicleGrantItem?.priceAmount
      vehicleGrantItemCode = vehicleGrantItem?.itemCode
    }

    const hasReceivedSubsidy =
      await this.energyFundsClientService.checkVehicleSubsidyAvilability(
        auth,
        vin,
      )

    return {
      vehicleGrant,
      vehicleGrantItemCode,
      hasReceivedSubsidy,
    }
  }
}
