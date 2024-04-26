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
    const vehicle = await this.vehiclesApiWithAuth(
      auth,
    ).basicVehicleInformationGet({ permno: permno })
    if (!vehicle) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }
    if (
      vehicle.owners &&
      !vehicle.owners.some((owner) => owner.persidno === auth.nationalId)
    ) {
      throw Error(
        'Did not find the vehicle with for that permno, or you are neither owner nor co-owner of the vehicle',
      )
    }

    const vehicleGrantItem =
      await this.energyFundsClientService.getCatalogValueForVehicle(auth, {
        vehicleRegistrationCode: vehicle.euGroup,
        firstRegistrationDate: vehicle.firstregdate,
        newRegistrationDate: vehicle.newregdate,
        permno: vehicle.permno,
      })

    if (!vehicleGrantItem)
      throw new Error('Could not get available grants for this vehicle')

    const hasReceivedSubsidy = vehicle.vin
      ? await this.energyFundsClientService.checkVehicleSubsidyAvilability(
          auth,
          vehicle.vin,
        )
      : false

    return {
      vehicleGrant: vehicleGrantItem[0]?.priceAmount,
      vehicleGrantItemCode: vehicleGrantItem[0]?.itemCode,
      hasReceivedSubsidy,
      permno: vehicle.permno,
      make: vehicle.make,
      color: vehicle.color,
      requireMileage: vehicle.requiresMileageRegistration,
      newRegistrationDate: vehicle.newregdate,
      firstRegistrationDate: vehicle.firstregdate,
      vin: vehicle.vin,
    }
  }
}
