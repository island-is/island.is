import { Inject } from '@nestjs/common'
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize } from '../auth'
import { VehicleOwnerModel } from './vehicleOwner.model'
import { VehicleOwnerService } from './vehicleOwner.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerResolver {
  constructor(
    private vehicleOwnerService: VehicleOwnerService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Query(() => [VehicleOwnerModel])
  async skilavottordAllVehicleOwners(): Promise<VehicleOwnerModel[]> {
    const res = await this.vehicleOwnerService.findAll()
    this.logger.debug(
      'getAllVehicleOwners responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  //TODO find right name
  @Query(() => VehicleOwnerModel)
  async skilavottordVehiclesFromLocal(
    @Args('nationalId') nationalId: string,
  ): Promise<VehicleOwnerModel> {
    const res = await this.vehicleOwnerService.findByNationalId(nationalId)
    this.logger.warn(
      'getVehicleOwnersByNationaId responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Authorize({ roles: ['developer', 'recyclingCompany', 'recyclingFund'] })
  @Query(() => [VehicleOwnerModel])
  async skilavottordRecyclingPartnerVehicles(
    @Args('partnerId') partnerId: string,
  ): Promise<VehicleOwnerModel[]> {
    const res = await this.vehicleOwnerService.findRecyclingPartnerVehicles(
      partnerId,
    )
    this.logger.debug('getTEST responce:' + JSON.stringify(res, null, 2))
    return res
  }

  @Mutation(() => Boolean)
  async createSkilavottordVehicleOwner(
    @Args('nationalId') nationalId: string,
    @Args('name') name: string,
  ) {
    const vm = new VehicleOwnerModel()
    vm.nationalId = nationalId
    vm.personname = name

    this.logger.info(
      'create new createSkilavottordVehicleOwner...' +
        JSON.stringify(vm, null, 2),
    )
    return await this.vehicleOwnerService.create(vm)
  }
}
