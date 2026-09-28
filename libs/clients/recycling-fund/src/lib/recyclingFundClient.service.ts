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
import { logger } from '@island.is/logging'

// Taking the last three characters hides nothing when the registration number
// is three characters or fewer, and an Icelandic personalised plate can be that
// short. Those are left out of the log rather than written in full. These lines
// are logged on every successful call, not only on a failure.
const SHORTENED = 3

export const shortPermno = (permno: string): string =>
  permno && permno.length > SHORTENED ? permno.slice(-SHORTENED) : ''

@Injectable()
export class RecyclingFundClientService {
  constructor(private readonly api: XRoadApi) {}
  private recyclingFundApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async createOwner(user: User, applicantName: string): Promise<void> {
    const request: XRoadControllerCreateVehicleOwnerRequest = {
      createXRoadVehicleOwnerDto: {
        nationalId: user.nationalId,
        name: applicantName,
      } as CreateXRoadVehicleOwnerDto,
    }

    const r = await this.recyclingFundApiWithAuth(
      user,
    ).xRoadControllerCreateVehicleOwner(request)

    logger.info('Car-recycling:createOwner')
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

    logger.info('Car-recycling: createVehicle', {
      permno: shortPermno(permno),
    })
    return r
  }

  async recycleVehicle(
    user: User,
    fullName: string,
    permno: string,
    requestType: CreateXRoadRecyclingRequestDtoRequestTypeEnum,
  ) {
    const request: XRoadControllerCreateRecyclingRequestRequest = {
      createXRoadRecyclingRequestDto: {
        nationalId: user.nationalId,
        permno,
        requestType,
        fullName,
      } as CreateXRoadRecyclingRequestDto,
    }

    const r = await this.recyclingFundApiWithAuth(
      user,
    ).xRoadControllerCreateRecyclingRequest(request)

    logger.info('Car-recycling:recycleVehicle', {
      permno: shortPermno(permno),
      requestType,
    })
    return r
  }
}
