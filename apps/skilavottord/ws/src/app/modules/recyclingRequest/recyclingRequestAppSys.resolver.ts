import { Inject, NotFoundException, forwardRef } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import { Authorize, Role, CurrentUser, User } from '../auth'
import { VehicleModel } from '../vehicle'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
  RecyclingRequestResponse,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'
import { SamgongustofaService } from '../samgongustofa'

// @Authorize()
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestAppSysResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequestsAppSys(): Promise<
    RecyclingRequestModel[]
  > {
    const recyclingRequests = await this.recyclingRequestService.findAll()
    return recyclingRequests
  }

  @Query(() => [RecyclingRequestModel])
  async skilavottordUserRecyclingRequestAppSys(
    @CurrentUser() user: User,
    @Args('permno') perm: string,
  ): Promise<RecyclingRequestModel[]> {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      perm,
      false,
    )
    if (!vehicle) {
      throw new NotFoundException(
        `Car with license plate ${perm} was not found for this user`,
      )
    }

    const userLastRecyclingRequest =
      await this.recyclingRequestService.findUserRecyclingRequestWithPermno(
        vehicle,
      )
    return userLastRecyclingRequest
  }

  @Authorize({
    roles: [
      Role.developer,
      Role.recyclingCompany,
      Role.recyclingFund,
      Role.recyclingCompanyAdmin,
    ],
  })
  @Query(() => [RecyclingRequestModel])
  async skilavottordRecyclingRequestsAppSys(
    @Args('permno') perm: string,
  ): Promise<RecyclingRequestModel[]> {
    const recyclingRequests =
      await this.recyclingRequestService.findAllWithPermno(perm)
    return recyclingRequests
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingCompany, Role.recyclingCompanyAdmin],
  })
  @Query(() => Boolean)
  async skilavottordDeRegisterVehicleAppSys(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<boolean> {
    return this.recyclingRequestService.deRegisterVehicle(nid, station)
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingCompany, Role.recyclingCompanyAdmin],
  })
  @Query(() => VehicleModel)
  async skilavottordVehicleReadyToDeregisteredAppSys(
    @CurrentUser() user: User,
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    return this.recyclingRequestService.getVehicleInfoToDeregistered(
      user,
      permno,
    )
  }

  @Mutation(() => RecyclingRequestResponse)
  async createSkilavottordRecyclingRequestAppSys(
    @CurrentUser() user: User,
    @Args({ name: 'requestType', type: () => RecyclingRequestTypes })
    requestType: RecyclingRequestTypes,
    @Args('permno') permno: string,
  ): Promise<typeof RecyclingRequestResponse> {
    if (requestType === 'pendingRecycle' || requestType === 'cancelled') {
      const vehicle = await this.samgongustofaService.getUserVehicle(
        user.nationalId,
        permno,
      )
      // Check if user owns the vehicle
      if (!vehicle) {
        throw new NotFoundException(
          `User doesn't have right to deregistered the vehicle`,
        )
      }
    }
    const hasPermission = [
      Role.developer,
      Role.recyclingCompany,
      Role.recyclingCompanyAdmin,
    ].includes(user.role)
    if (requestType === 'deregistered' && !hasPermission) {
      throw new NotFoundException(
        `User doesn't have right to deregistered the vehicle`,
      )
    }

    return this.recyclingRequestService.createRecyclingRequest(
      user,
      requestType,
      permno,
    )
  }
}
