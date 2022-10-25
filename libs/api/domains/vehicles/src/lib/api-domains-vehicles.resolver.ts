import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { Inject, UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehiclesHistory, VehiclesList } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { VehiclesVehicleSearch } from '../models/getVehicleSearch.model'
import {
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithFees,
} from '../models/getCurrentVehicles.model'
import { GetVehicleSearchInput } from '../dto/getVehicleSearchInput'
import { GetCurrentVehiclesInput } from '../dto/getCurrentVehiclesInput'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { VehicleMiniDto } from '@island.is/clients/vehicles'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => VehiclesList, { name: 'vehiclesList', nullable: true })
  @Audit()
  async getVehicleList(@CurrentUser() user: User) {
    const data = await this.vehiclesService.getVehiclesForUser(
      user,
      false,
      false,
    )
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/ownership/${user.nationalId}`

    return { ...data, downloadServiceURL }
  }

  @Query(() => VehiclesHistory, { name: 'vehiclesHistoryList', nullable: true })
  @Audit()
  async getVehicleHistory(@CurrentUser() user: User) {
    return await this.vehiclesService.getVehiclesForUser(user, true, true)
  }

  @Scopes(ApiScope.internal)
  @Query(() => VehiclesDetail, { name: 'vehiclesDetail', nullable: true })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    const data = await this.vehiclesService.getVehicleDetail(user, {
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
    const downloadServiceURL = `${this.downloadServiceConfig.baseUrl}/download/v1/vehicles/history/${input.permno}`
    return { ...data, downloadServiceURL }
  }

  @Query(() => Number, {
    name: 'vehiclesSearchLimit',
    nullable: true,
  })
  @Audit()
  async getVehiclesSearchLimit(@CurrentUser() user: User) {
    return await this.vehiclesService.getSearchLimit(user)
  }

  @Query(() => VehiclesVehicleSearch, {
    name: 'vehiclesSearch',
    nullable: true,
  })
  @Audit()
  async getVehicleSearch(
    @Args('input') input: GetVehicleSearchInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehiclesSearch(user, input.search)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [VehiclesCurrentVehicle], {
    name: 'currentVehicles',
    nullable: true,
  })
  @Audit()
  async getCurrentVehicles(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return (
      await this.vehiclesService.getCurrentVehicles(
        user,
        input.showOwned,
        input.showCoowned,
        input.showOperated,
      )
    )?.map((vehicle: VehicleMiniDto) => ({
      permno: vehicle.permno,
      make: vehicle.make,
      color: vehicle.color,
      role: vehicle.role,
      isStolen: Math.random() < 0.2, //TODOx is missing for api endpoint
    }))
  }

  @Scopes(ApiScope.internal)
  @Query(() => [VehiclesCurrentVehicleWithFees], {
    name: 'currentVehiclesWithFees',
    nullable: true,
  })
  @Audit()
  async getCurrentVehiclesWithFees(
    @Args('input') input: GetCurrentVehiclesInput,
    @CurrentUser() user: User,
  ) {
    return await Promise.all(
      (await this.getCurrentVehicles(input, user)).map(
        async (vehicle: VehiclesCurrentVehicleWithFees) => {
          // TODOx use new api endpoint from FJS
          const vehicleDetails = await this.vehiclesService.getVehicleDetail(
            user,
            {
              clientPersidno: user.nationalId,
              permno: vehicle.permno || '',
            },
          )

          vehicle.fees = vehicleDetails?.fees
          return vehicle
        },
      ),
    )
  }
}
