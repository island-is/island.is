import { Inject, NotFoundException, forwardRef } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, Role, CurrentUser, User } from '../auth'
import { VehicleModel } from '../vehicle'
import {
  RecyclingRequestModel,
  RecyclingRequestTypes,
  RecyclingRequestResponse,
} from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'
import { SamgongustofaService } from '../samgongustofa'

@Authorize()
@Resolver(() => RecyclingRequestModel)
export class RecyclingRequestResolver {
  constructor(
    private recyclingRequestService: RecyclingRequestService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => [RecyclingRequestModel])
  async skilavottordAllRecyclingRequests(): Promise<RecyclingRequestModel[]> {
    const recyclingRequests = await this.recyclingRequestService.findAll()
    this.logger.info(
      'skilavottordAllRecyclingRequests response:' +
        JSON.stringify(recyclingRequests, null, 2),
    )
    return recyclingRequests
  }

  @Query(() => [RecyclingRequestModel])
  async skilavottordUserRecyclingRequest(
    @CurrentUser() user: User,
    @Args('permno') perm: string,
  ): Promise<RecyclingRequestModel[]> {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      perm,
    )
    const hasPermission = [Role.recyclingCompany, Role.developer].includes(
      user.role,
    )
    if (!vehicle || !hasPermission) {
      this.logger.error(
        `User does not have permission to call skilavottordUserRecyclingRequest action`,
      )
      throw new NotFoundException()
    }

    const userLastRecyclingRequest = await this.recyclingRequestService.findUserRecyclingRequestWithPermno(
      vehicle,
    )
    this.logger.info(
      'skilavottordUserRecyclingRequest responce:' +
        JSON.stringify(userLastRecyclingRequest, null, 2),
    )
    return userLastRecyclingRequest
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingCompany, Role.recyclingFund],
  })
  @Query(() => [RecyclingRequestModel])
  async skilavottordRecyclingRequests(
    @Args('permno') perm: string,
  ): Promise<RecyclingRequestModel[]> {
    const recyclingRequests = await this.recyclingRequestService.findAllWithPermno(
      perm,
    )
    this.logger.info(
      'skilavottordRecyclingRequest responce:' +
        JSON.stringify(recyclingRequests, null, 2),
    )
    return recyclingRequests
  }

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => Boolean)
  async skilavottordDeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<boolean> {
    return this.recyclingRequestService.deRegisterVehicle(nid, station)
  }

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => VehicleModel)
  async skilavottordVehicleReadyToDeregistered(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    return this.recyclingRequestService.getVehicleInfoToDeregistered(permno)
  }

  @Mutation(() => RecyclingRequestResponse)
  async createSkilavottordRecyclingRequest(
    @CurrentUser() user: User,
    @Args({ name: 'requestType', type: () => RecyclingRequestTypes })
    requestType: RecyclingRequestTypes,
    @Args('permno') permno: string,
  ): Promise<typeof RecyclingRequestResponse> {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      permno,
    )
    if (requestType === 'pendingRecycle' || requestType === 'cancelled') {
      // Check if user has the vehicle
      if (!vehicle) {
        this.logger.error(
          `User doesn't have right to deregistered the vehicle.`,
        )
        throw new NotFoundException(
          `User doesn't have right to deregistered the vehicle`,
        )
      }
    }
    const hasPermission = [Role.developer, Role.recyclingCompany].includes(
      user.role,
    )
    if (requestType === 'deregistered' && !hasPermission) {
      this.logger.error(`User doesn't have right to deregistered the vehicle.`)
      throw new NotFoundException(
        `User doesn't have right to deregistered the vehicle`,
      )
    }

    return this.recyclingRequestService.createRecyclingRequest(
      user,
      requestType,
      vehicle,
    )
  }
}
