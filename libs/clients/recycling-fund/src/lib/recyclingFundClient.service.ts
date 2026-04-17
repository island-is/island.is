import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  XRoadApi,
  XRoadControllerCreateVehicleRequest,
  type CreateXRoadVehicleOwnerDto,
  type XRoadControllerCreateVehicleOwnerRequest,
  type CreateXRoadVehicleDto,
  type CreateXRoadRecyclingRequestDto,
  XRoadControllerCreateRecyclingRequestRequest,
  CreateXRoadRecyclingRequestDtoRequestTypeEnum,
} from '../../gen/fetch'

@Injectable()
export class RecyclingFundClientService {
  constructor(private readonly api: XRoadApi) {}
  private recyclingFundApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  healthCheck(user: User): Promise<void> {
    // const r = this.recyclingFundApiWithAuth(user).xRoadControllerHealth()
    //console.log('HEALTH CHECK RESPONSE-23', { result: r })
    return this.createOwner(user, 'BK-TEST DUDE')
  }

  async createOwner(user: User, applicantName: string): Promise<void> {
    const request: XRoadControllerCreateVehicleOwnerRequest = {
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
      createXRoadVehicleOwnerDto: {
        nationalId: user.nationalId,
        name: applicantName,
      } as CreateXRoadVehicleOwnerDto,
    }

    const r = await this.recyclingFundApiWithAuth(
      user,
    ).xRoadControllerCreateVehicleOwner(request)

    console.log('CREATE OWNER RESPONSE-27', { result: r })
    return r
  }

  async createVehicle(
    user: User,
    permno: string,
    mileage: number,
    vin: string,
    make: string,
    firstRegistrationDate: Date | null,
    color: string,
  ): Promise<void> {
    const request: XRoadControllerCreateVehicleRequest = {
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
      createXRoadVehicleDto: {
        nationalId: user.nationalId,
        permno,
        mileage,
        vin,
        make,
        firstRegistrationDate: firstRegistrationDate?.toISOString(),
        color,
      } as CreateXRoadVehicleDto,
    }

    const r = await this.recyclingFundApiWithAuth(
      user,
    ).xRoadControllerCreateVehicle(request)

    console.log('CREATE VEHICLE RESPONSE-27', { result: r })
    return r
  }

  async recycleVehicle(
    user: User,
    fullName: string,
    permno: string,
    requestType: CreateXRoadRecyclingRequestDtoRequestTypeEnum,
  ) {
    const request: XRoadControllerCreateRecyclingRequestRequest = {
      xRoadClient: 'IS-DEV/GOV/10000/island-is-client',
      createXRoadRecyclingRequestDto: {
        nationalId: user.nationalId,
        permno,
        requestType,
        fullName,
      } as CreateXRoadRecyclingRequestDto,
    }

    return await this.recyclingFundApiWithAuth(
      user,
    ).xRoadControllerCreateRecyclingRequest(request)
  }
}
