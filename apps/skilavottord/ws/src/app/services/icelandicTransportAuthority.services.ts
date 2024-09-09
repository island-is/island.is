import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common/decorators/core'
import { SamgongustofaService } from '../modules/samgongustofa'
import { VehicleInformationMini } from '../modules/samgongustofa/samgongustofa.model'
import { VehicleModel, VehicleService } from '../modules/vehicle'
import { VehicleOwnerModel } from '../modules/vehicleOwner'
import { VehicleOwnerService } from '../modules/vehicleOwner/vehicleOwner.service'

@Injectable()
export class IcelandicTransportAuthorityServices {
  constructor(
    private vehicleService: VehicleService,
    private ownerService: VehicleOwnerService,
    private samgongustofaService: SamgongustofaService,
  ) {}

  async checkIfCurrentUser(permno: string): Promise<VehicleInformationMini> {
    //Get the latest vehicle information from Samgongustofa
    const result = await this.samgongustofaService.getVehicleInformation(permno)

    if (result && result.data) {
      const ownerSocialSecurityNumber = result.data.ownerSocialSecurityNumber

      if (!ownerSocialSecurityNumber) {
        logger.error(
          `car-recycling: Didnt find the current owner in the vehicleinformationmini ${permno.slice(
            -3,
          )}`,
        )
        throw new Error(
          'car-recycling: Didnt find the current owner in the vehicleinformationmini',
        )
      }

      // If current owner hasn't sent in an car-recycling application, then he is not registered in Vehicle_Owner and therefore he needs to be registered.
      const owner = new VehicleOwnerModel()
      owner.nationalId = ownerSocialSecurityNumber
      owner.personname = ownerSocialSecurityNumber //Samgongustofa REST endpoint doesn't have owner name

      const isOwner = await this.ownerService.create(owner)

      // If the owner has been found or created in the database, then we can update the vehicle owner if needed
      if (isOwner) {
        const vehicle = new VehicleModel()
        vehicle.vehicleId = permno

        vehicle.ownerNationalId = owner.nationalId

        await this.vehicleService.create(vehicle)
      }
      return result.data
    }

    logger.error(
      `car-recycling: Failed to get current owner info in checkIfCurrentUser when deregistering vehicle  ${permno.slice(
        -3,
      )}`,
    )

    throw new Error(
      'car-recycling: Failed to get current owner info in checkIfCurrentUser when deregistering vehicle',
    )
  }
}
