import { forwardRef,Inject, NotFoundException } from '@nestjs/common'
import { Args, Int,Mutation, Query, Resolver } from '@nestjs/graphql'
import parse from 'date-fns/parse'

import { Authorize, CurrentUser, Role,User } from '../auth'
import { RecyclingRequestTypes } from '../recyclingRequest'
import { SamgongustofaService } from '../samgongustofa'

import { VehicleConnection,VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'

@Authorize()
@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => VehicleConnection)
  async skilavottordAllDeregisteredVehicles(
    @Args('first', { type: () => Int }) first: number,
    @Args('after') after: string,
  ): Promise<VehicleConnection> {
    const {
      pageInfo,
      totalCount,
      data,
    } = await this.vehicleService.findAllByFilter(first, after, {
      requestType: RecyclingRequestTypes.deregistered,
    })
    return {
      pageInfo,
      count: totalCount,
      items: data,
    }
  }

  @Authorize({
    roles: [Role.developer, Role.recyclingCompany],
  })
  @Query(() => VehicleConnection)
  async skilavottordRecyclingPartnerVehicles(
    @CurrentUser() user: User,
    @Args('first', { type: () => Int }) first: number,
    @Args('after') after: string,
  ): Promise<VehicleConnection> {
    if (!user.partnerId) {
      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        count: 0,
        items: [],
      }
    }
    const {
      pageInfo,
      totalCount,
      data,
    } = await this.vehicleService.findAllByFilter(first, after, {
      partnerId: user.partnerId,
      requestType: RecyclingRequestTypes.deregistered,
    })
    return {
      pageInfo,
      count: totalCount,
      items: data,
    }
  }

  @Query(() => VehicleModel)
  async skilavottordVehicleById(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    const vehicle = await this.vehicleService.findByVehicleId(permno)
    return vehicle
  }

  @Mutation(() => Boolean)
  async createSkilavottordVehicle(
    @CurrentUser() user: User,
    @Args('permno') permno: string,
  ) {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      permno,
    )
    if (!vehicle) {
      throw new NotFoundException(`User does not have this vehicle`)
    }

    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = vehicle.vinNumber
    newVehicle.newregDate = parse(
      vehicle.firstRegDate,
      'dd.MM.yyyy',
      new Date(),
    )
    newVehicle.vehicleColor = vehicle.color
    newVehicle.vehicleType = vehicle.type
    newVehicle.ownerNationalId = user.nationalId
    newVehicle.vehicleId = vehicle.permno
    return await this.vehicleService.create(newVehicle)
  }
}
