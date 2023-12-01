// import { VehicleModel } from '../vehicle.model'

import { VehicleModel } from '../vehicle.model'

export class UtilTest {
  //+add
  add(a: number, b: number): number {
    return a + b
  }

  //+findByVehicleId
  // async findByVehicleId(vehicleId: string): Promise<VehicleModel> {
  //   try {
  //     return await VehicleModel.findOne({
  //       where: { vehicleId },
  //     })
  //   } catch (error) {
  //     throw new Error('Failed on findByVehicleId request with error:' + error)
  //   }
  // }

  //+create
  async create(vehicle: VehicleModel): Promise<boolean> {
    try {
      // Check if Vehicle is already in database
      // const findVehicle = await this.findByVehicleId(vehicle.vehicleId)
      // if (findVehicle) {
      //   return true
      // }
      return true

      // Save vehicle to database
      await vehicle.save()
      return true
    } catch (err) {
      throw new Error(
        `Getting error while trying to create new vehicle with number: ${vehicle.vehicleId}`,
      )
    }
  }
}
