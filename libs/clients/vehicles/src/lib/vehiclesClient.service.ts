import { Injectable } from '@nestjs/common'
import { VehicleSearchApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  VehiclesResponseDto,
  mapVehicleResponseDto,
} from './dtos/vehiclesResponse.dto'
import { GetVehiclesInput } from './input/getVehicles.input'

@Injectable()
export class VehiclesClientService {
  constructor(private readonly vehiclesSearchApi: VehicleSearchApi) {}

  private vehiclesApiWithAuth = (user: User) =>
    this.vehiclesSearchApi.withMiddleware(new AuthMiddleware(user as Auth))

  getVehicles = async (
    user: User,
    input: GetVehiclesInput,
  ): Promise<VehiclesResponseDto | null> => {
    const res = await this.vehiclesApiWithAuth(
      user,
    ).currentvehicleswithmileageandinspGet({
      page: input.page,
      pageSize: input.pageSize,
      onlyMileageRegisterableVehicles: input.onlyMileageRegisterableVehicles,
      onlyMileageRequiredVehicles: input.onlyMileageRequiredVehicles,
      permno: input.query
        ? input.query.length < 5
          ? `${input.query}*`
          : `${input.query}`
        : undefined,
    })

    return mapVehicleResponseDto(res)
  }
}
