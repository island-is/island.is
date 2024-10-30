import { Injectable } from '@nestjs/common'
import { EnergyFundsClientService } from '@island.is/clients/energy-funds'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'

@Injectable()
export class EnergyFundsService {
  constructor(
    private readonly energyFundsClientService: EnergyFundsClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
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
        'Did not find the vehicle with for that vin number, or you are not the owner of the vehicle',
      )
    }

    const vehicleGrantItem =
      await this.energyFundsClientService.getCatalogValueForVehicle(
        auth,
        currentVehicle,
      )

    if (!vehicleGrantItem)
      throw new Error('Could not get available grants for this vehicle')

    const hasReceivedSubsidy =
      await this.energyFundsClientService.checkVehicleSubsidyAvilability(
        auth,
        vin,
      )

    return {
      vehicleGrant: vehicleGrantItem[0]?.priceAmount,
      vehicleGrantItemCode: vehicleGrantItem[0]?.itemCode,
      hasReceivedSubsidy,
    }
  }

  async getVehicleDetailsWithGrant(auth: User, permno: string) {
    // Get current vehicle information where you are (main) owner
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      permno: permno,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    const basicVehicle = await this.vehiclesApiWithAuth(
      auth,
    ).basicVehicleInformationGet({ permno: permno })

    if (!result || !result.data || !result.totalRecords || !basicVehicle) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are not owner of the vehicle',
      )
    }

    const vehicle = result.data[0]

    const vehicleGrantItem =
      await this.energyFundsClientService.getCatalogValueForVehicle(auth, {
        vehicleRegistrationCode: basicVehicle.euGroup,
        firstRegistrationDate: basicVehicle.firstregdate,
        newRegistrationDate: basicVehicle.newregdate,
        permno: vehicle.permno,
      })

    if (!vehicleGrantItem)
      throw new Error('Could not get available grants for this vehicle')

    const hasReceivedSubsidy = basicVehicle.vin
      ? await this.energyFundsClientService.checkVehicleSubsidyAvilability(
          auth,
          basicVehicle.vin,
        )
      : false

    return {
      vehicleGrant: vehicleGrantItem[0]?.priceAmount,
      vehicleGrantItemCode: vehicleGrantItem[0]?.itemCode,
      hasReceivedSubsidy,
      permno: vehicle.permno,
      make: vehicle.make,
      color: vehicle.colorName,
      requireMileage: vehicle.requiresMileageRegistration,
      newRegistrationDate: basicVehicle.newregdate,
      firstRegistrationDate: basicVehicle.firstregdate,
      vin: basicVehicle.vin,
    }
  }
}
